"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserModal } from "@/hooks/use-user-modal";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const roleOption = [
  {
    label: "Admin",
    value: "ADMIN",
  },
  {
    label: "Product Manager",
    value: "PRODUCT_MANAGER",
  },
  {
    label: "Sales Manager",
    value: "SALES_MANAGER",
  },
  {
    label: "Viewer",
    value: "VIEWER",
  },
];

const userProfileFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["ADMIN", "PRODUCT_MANAGER", "SALES_MANAGER", "VIEWER"]),
});

const userPasswordFormSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const UserModal = () => {
  const router = useRouter();
  const userStore = useUserModal();

  const [updatePassword, setUpdatePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const userProfileForm = useForm<z.infer<typeof userProfileFormSchema>>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "VIEWER",
    },
  });

  const userPasswordForm = useForm<z.infer<typeof userPasswordFormSchema>>({
    resolver: zodResolver(userPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (userStore.isEditing) {
      userProfileForm.reset({
        name: userStore.userData?.name!,
        email: userStore.userData?.email!,
        role: userStore.userData?.role! as any,
      });

      userPasswordForm.reset({
        password: "",
        confirmPassword: "",
      });
    }
  }, [
    userStore.isEditing,
    userStore.userData,
    userProfileForm,
    userPasswordForm,
  ]);

  const onSubmit = async (
    profileValues: z.infer<typeof userProfileFormSchema>,
    passwordValues: z.infer<typeof userPasswordFormSchema>
  ) => {
    try {
      setLoading(true);

      if (updatePassword) {
        if (passwordValues.password !== passwordValues.confirmPassword) {
          toast.error("Password tidak sama");
          return;
        }
      }

      const response = await axios.put(
        `/api/auth/users/${userStore.userData?.id}`,
        {
          id: userStore.userData?.id,
          name: profileValues.name,
          email: profileValues.email,
          role: profileValues.role,
          updatePassword: updatePassword,
          password: passwordValues.password,
        }
      );

      toast.success("User updated successfully");

      userProfileForm.reset();
      setUpdatePassword(false);
      userStore.setIsEditing(false);
      userStore.userSetter(response.data?.users);
      userStore.onClose();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Perbaharui Data User"
      description="Perbaharui data user yang sudah ada."
      isOpen={userStore.isOpen}
      onClose={userStore.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-4">
            <Form {...userProfileForm}>
              <form className="space-y-4">
                <FormField
                  control={userProfileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama User</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Masukkan nama user"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userProfileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email User</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Masukkan email user"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userProfileForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role User</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Merchant..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOption.map((role) => (
                            <SelectItem
                              value={role.value}
                              key={role.value}
                              placeholder="Pilih Merchant..."
                            >
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <div className="flex gap-2 items-center">
              <Switch
                id="usePassword"
                checked={updatePassword}
                onCheckedChange={setUpdatePassword}
              />
              <Label htmlFor="usePassword">Ubah password user</Label>
            </div>
            {updatePassword && (
              <Form {...userPasswordForm}>
                <form className="space-y-4">
                  <FormField
                    control={userPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Baru</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Masukkan password baru"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Password Baru</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Konfirmasi password baru"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                disabled={loading}
                variant="outline"
                onClick={userStore.onClose}
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                type="submit"
                onClick={() => {
                  onSubmit(
                    userProfileForm.getValues(),
                    userPasswordForm.getValues()
                  );
                }}
              >
                Perbaharui User
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
