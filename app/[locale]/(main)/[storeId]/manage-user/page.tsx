"use client";

import { DeleteUserButton } from "@/components/delete-user-button";
import LoadingIndicator from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Subheading } from "@/components/ui/subheading";
import { useUserModal } from "@/hooks/use-user-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import axios from "axios";
import { Edit2Icon, User2Icon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

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

const userFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["ADMIN", "PRODUCT_MANAGER", "SALES_MANAGER", "VIEWER"]),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

const UserTile = ({
  user,
  currentUser,
  userStore,
  setUsers,
  t,
}: {
  user: User;
  currentUser: string;
  userStore: any;
  setUsers: any;
  t: any;
}) => {
  return (
    <div
      key={user.id}
      className="flex flex-col md:flex-row items-center p-4 bg-slate-200 rounded-lg shadow-md"
    >
      <div className="flex-1">
        <div className="flex gap-1">
          <p className="text-lg font-semibold">{user.name}</p>
          {user.id === currentUser && (
            <p className="text-lg font-semibold">({t("userYou")})</p>
          )}
        </div>
        <p className="text-sm">{user.email}</p>
      </div>
      {user.id !== currentUser && (
        <>
          <Button
            variant="ghost"
            className="w-full md:w-auto"
            onClick={() => {
              userStore.setIsEditing(true);
              userStore.setUserData(user);
              userStore.setUserSetter(setUsers);
              userStore.onOpen();
            }}
          >
            <Edit2Icon className="w-6 h-6" />
          </Button>
          <DeleteUserButton
            key={user.id}
            userId={user.id}
            setUsers={setUsers}
          />
        </>
      )}
    </div>
  );
};

const ManageUser = () => {
  const t = useTranslations("ManageUser");
  const userStore = useUserModal();

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "VIEWER",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const getProfile = async () => {
      const response = await axios.get("/api/auth/users");

      setUsers(response.data?.users);
      setCurrentUser(response.data?.currentUser);

      setLoading(false);
    };

    getProfile();
  }, []);

  async function handleAddUser(values: z.infer<typeof userFormSchema>) {
    try {
      setFormLoading(true);

      const user = {
        name: values.name,
        email: values.email,
        role: values.role,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      const response = await axios.post("/api/auth/users", user);

      if (response.status === 200) {
        toast.success(t("addUserSuccess"));
        userForm.reset();
        userForm.setValue("role", "VIEWER");
        setUsers(response.data?.users);
      }
    } catch (error) {
      console.log(error);
      toast.error(t("addUserFailed"));
    } finally {
      setFormLoading(false);
    }
  }

  if (loading) return <LoadingIndicator />;

  return (
    <div className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <div className="flex-1 space-y-4">
        <Heading
          icon={<UsersIcon className="w-8 h-8" />}
          title={t("title")}
          description={t("description")}
        />
        <Separator />
        <div className="w-full flex gap-4 h-full">
          <div className="w-4/5 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              {users.some((user) => user.role === "ADMIN") && (
                <>
                  <Subheading
                    icon={<User2Icon className="w-8 h-8" />}
                    title={t("adminTitle")}
                    description={t("adminDescription")}
                  />
                  <Separator />
                </>
              )}
              {users
                .filter((user) => user.role === "ADMIN")
                .map((user) =>
                  UserTile({ user, currentUser, userStore, setUsers, t })
                )}
            </div>
            {users.some((user) => user.role === "PRODUCT_MANAGER") && (
              <div className="flex flex-col gap-2">
                <>
                  <Subheading
                    icon={<User2Icon className="w-8 h-8" />}
                    title={t("productManagerTitle")}
                    description={t("productManagerDescription")}
                  />
                  <Separator />
                </>
                {users
                  .filter((user) => user.role === "PRODUCT_MANAGER")
                  .map((user) =>
                    UserTile({ user, currentUser, userStore, setUsers, t })
                  )}
              </div>
            )}
            {users.some((user) => user.role === "SALES_MANAGER") && (
              <div className="flex flex-col gap-2">
                <>
                  <Subheading
                    icon={<User2Icon className="w-8 h-8" />}
                    title={t("salesManagerTitle")}
                    description={t("salesManagerDescription")}
                  />
                  <Separator />
                </>
                {users
                  .filter((user) => user.role === "SALES_MANAGER")
                  .map((user) =>
                    UserTile({ user, currentUser, userStore, setUsers, t })
                  )}
              </div>
            )}
            {users.some((user) => user.role === "VIEWER") && (
              <div className="flex flex-col gap-2">
                <>
                  <Subheading
                    icon={<User2Icon className="w-8 h-8" />}
                    title={t("viewerTitle")}
                    description={t("viewerDescription")}
                  />
                  <Separator />
                </>
                {users
                  .filter((user) => user.role === "VIEWER")
                  .map((user) =>
                    UserTile({ user, currentUser, userStore, setUsers, t })
                  )}
              </div>
            )}
          </div>
          <Separator orientation="vertical" className="h-[36rem]" />
          <div className="w-2/5 flex flex-col gap-2">
            <Subheading
              title={t("addUserTitle")}
              description={t("addUserDescription")}
              icon={<UsersIcon className="w-8 h-8" />}
            />
            <Separator />
            <Form {...userForm}>
              <form
                className="space-y-4"
                onSubmit={userForm.handleSubmit(handleAddUser)}
              >
                <FormField
                  control={userForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("userName")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={formLoading}
                          type="text"
                          placeholder={t("userNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("userEmail")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={formLoading}
                          type="email"
                          placeholder={t("userEmailPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("userRole")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={formLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("userRolePlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOption.map((role) => (
                            <SelectItem
                              value={role.value}
                              key={role.value}
                              placeholder={t("userRolePlaceholder")}
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
                <FormField
                  control={userForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("userPassword")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={formLoading}
                          type="password"
                          placeholder={t("userPasswordPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("userPasswordConfirmation")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={formLoading}
                          type="password"
                          placeholder={t("userPasswordConfirmationPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={formLoading}>
                  {t("addUserButton")}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
