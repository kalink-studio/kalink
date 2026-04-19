import type { Access } from "payload";

export const anyone: Access = () => true;

export const isAdminUser = (collection?: string | null) => collection === "admins";

export const adminsOnly: Access = ({ req: { user } }) => isAdminUser(user?.collection);

export const adminsOnlyAdmin = ({
  req: { user },
}: {
  req: { user: { collection?: string | null } | null };
}) => isAdminUser(user?.collection);

export const adminsOrPublished: Access = ({ req: { user } }) => {
  if (user?.collection === "admins") {
    return true;
  }

  return {
    _status: {
      equals: "published",
    },
  };
};
