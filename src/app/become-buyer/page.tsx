import { redirect } from "next/navigation";

export default function BecomeBuyerPage() {
  redirect("/sign-up?role=buyer");
}
