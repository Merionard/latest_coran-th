import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { theme } from "@prisma/client";
import Link from "next/link";

import { PropsWithChildren } from "react";

export const ThemeCard = (props: PropsWithChildren<theme>) => {
  return (
    <Card className="transition ease-in-out delay-150 hover:scale-105 duration-300 ">
      <CardHeader>
        <Link href={`/themes_coran/${props.id}`}>
          <CardTitle>{props.name}</CardTitle>
        </Link>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
};
