import { redirect } from "next/navigation";

export default function BecomeSellerPage() {
  redirect("/sign-up?role=seller");
}
