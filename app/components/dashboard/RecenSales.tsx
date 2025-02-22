import prisma from "@/app/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/util/formatPrice";

const getData = async () => {
  const data = await prisma.order.findMany({
    select: {
      amount: true,
      id: true,
      User: {
        select: {
          firstName: true,
          profileImage: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });
  return data;
};

const RecentSales = async () => {
  const data = await getData();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent sales</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <Avatar className="hidden sm:flex h-9 w-9">
              <AvatarImage src={item.User?.profileImage} alt="Avatar Image" />
              <AvatarFallback>
                {item.User?.firstName.slice(0, 3)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium">{item.User?.firstName}</p>
              <p className="text-sm text-muted-foreground">test@test.com</p>
            </div>
            <p className="ml-auto font-medium">{formatCurrency(item.amount)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentSales;
