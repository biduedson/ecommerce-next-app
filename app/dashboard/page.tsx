import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, PartyPopper, ShoppingBag, User2 } from "lucide-react";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import RecentSales from "../components/dashboard/RecenSales";
import Chart from "../components/dashboard/Chart";
import prisma from "../lib/db";

const getData = async () => {
  const now = new Date();
  const sevendaysAgo = new Date();
  sevendaysAgo.setDate(now.getDate() - 7);

  const data = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: sevendaysAgo,
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const result = data.map((item) => ({
    date: new Intl.DateTimeFormat("en-US").format(item.createdAt),
    revenue: item.amount / 100,
  }));
  return result;
};

const Dashboard = async () => {
  const data = await getData();
  return (
    <>
      <DashboardStats />

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-10">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Recent transactions from your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart data={data} />
          </CardContent>
        </Card>

        <RecentSales />
      </div>
    </>
  );
};

export default Dashboard;
