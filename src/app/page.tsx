"use client";

import { useForm } from "react-hook-form";
import { trpc } from "./_trpc/client";
import { User, defaultUserValues } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "@/lib/models";

export default function Home() {
  const { register, handleSubmit, reset } = useForm<User>({
    defaultValues: defaultUserValues,
    resolver: zodResolver(UserSchema),
  });

  const users = trpc.user.readAll.useQuery();
  const createUser = trpc.user.create.useMutation({
    onSuccess: () => {
      users.refetch();
      reset();
    },
  });
  const updateUser = trpc.user.update.useMutation({
    onSuccess: () => {
      users.refetch();
      reset();
    },
  });
  const deleteUser = trpc.user.delete.useMutation({
    onSuccess: () => {
      users.refetch();
    },
  });

  const onSubmit = (data: User) => {
    if (data.id) {
      updateUser.mutate(data);
    } else {
      createUser.mutate(data);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
      <h1>Users</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("name")} />
        <button className="p-2 bg-blue-500" type="submit">
          Submit
        </button>
      </form>
      <hr className="border border-gray-500 w-[30%]" />
      <ul className="list-disc">
        {users.isLoading ? (
          <li>Loading...</li>
        ) : (
          users.data?.map((user) => (
            <li key={user.id} className="flex gap-2 mb-1 items-center">
              <span>{user.name}</span>
              <button
                className="p-2 bg-green-500"
                onClick={() =>
                  reset(user, {
                    keepDefaultValues: true,
                  })
                }
              >
                Edit
              </button>
              <button
                className="p-2 bg-red-500"
                onClick={() => deleteUser.mutate(user)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
