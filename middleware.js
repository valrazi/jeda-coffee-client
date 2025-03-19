import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/sign-in", // Redirect to login page if not authenticated
  },
});

export const config = {
  matcher: ["/main/:path*"], // Protect all routes under /main/*
};
