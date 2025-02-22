"use client";
import { deleteProduct } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache"; // Importa um método experimental para desativar o cache.

const DeleteRoute = ({ params }: { params: { id: string } }) => {
  noStore();
  return (
    <div className="h-[80vh] w-full flex items-center justify-center ">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. Thias permanently delete this product
            and remove all data from from our server.
          </CardDescription>
        </CardHeader>
        <CardFooter className=" w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/products">Cancel</Link>
          </Button>
          <form action={deleteProduct}>
            <input type="hidden" name="productId" value={params.id} />
            <SubmitButton variant="destructive" text="Delete Product" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteRoute;
