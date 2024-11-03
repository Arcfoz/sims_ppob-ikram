"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchProfile, updateProfile, resetUpdateSuccess } from "@/store/slices/userSlice";
import { logout } from "@/store/slices/authSlice";
import { Loader2, LogOut, PenIcon, AtSign, User } from "lucide-react";
import { AppDispatch, RootState } from "@/store";
import Image from "next/image";

const profileSchema = z.object({
  first_name: z.string().min(1, { message: "Nama depan tidak boleh kosong" }),
  last_name: z.string().min(1, { message: "Nama belakang tidak boleh kosong" }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const { profile, loading, error, updateSuccess } = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
    },
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
      });
      setPreviewImage(null);
    }
  }, [profile, reset]);

  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false);
      setPreviewImage(null);
      reset({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      dispatch(resetUpdateSuccess());
      dispatch(fetchProfile());
    }
    if (error) {
    }
  }, [updateSuccess, error, dispatch, profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);

    if (fileInputRef.current?.files?.[0]) {
      formData.append("file", fileInputRef.current.files[0]);
    }

    dispatch(updateProfile(formData));
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageError(null);

    if (file) {
      if (file.size > 100 * 1024) {
        setImageError("Ukuran file maksimal 100KB");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setTimeout(() => {
          setImageError(null);
        }, 3000);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    reset({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className={`h-24 w-24 ${isEditing ? "cursor-pointer" : ""}`} onClick={handleImageClick}>
              <AvatarImage src={previewImage || profile.profile_image} className="object-cover" />
              <AvatarFallback>
                <Image src="/Profile Photo.png" width={100} height={100} alt="Default profile" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 shadow-sm z-10">
                <PenIcon className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          {isEditing && imageError && <div className="text-destructive font-semibold">{imageError}</div>}
          <h2 className="text-xl font-semibold">
            {profile.first_name} {profile.last_name}
          </h2>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png" onChange={handleImageChange} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input startIcon={AtSign} id="email" type="email" value={profile.email} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name">Nama Depan</Label>
            <Input startIcon={User} id="first_name" {...register("first_name")} disabled={!isEditing} className={!isEditing ? "bg-muted" : ""} />
            {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Nama Belakang</Label>
            <Input startIcon={User} id="last_name" {...register("last_name")} disabled={!isEditing} className={!isEditing ? "bg-muted" : ""} />
            {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
          </div>

          <div className="pt-4">
            {isEditing ? (
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button type="button" variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
                <Button type="button" variant="destructive" onClick={handleLogout} className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
