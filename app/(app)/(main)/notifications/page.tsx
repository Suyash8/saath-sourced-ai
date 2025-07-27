import { getUserIdFromSession } from "@/app/actions";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminApp } from "@/firebase/adminConfig";
import { BellRing } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Timestamp } from "firebase-admin/firestore";

interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: Timestamp;
  read: boolean;
  href?: string;
}

async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    const snapshot = await getAdminApp()
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("notifications")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Notification)
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default async function NotificationsPage() {
  const userId = await getUserIdFromSession();
  if (!userId) {
    redirect("/login");
  }

  const notifications = await getNotifications(userId);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Notifications" backHref="/dashboard" />
      <main className="container mx-auto p-4 space-y-4">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const notifCard = (
                <Card
                  key={notif.id}
                  className={`hover:bg-muted/50 transition-colors ${
                    notif.read ? "opacity-70" : ""
                  }`}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-1">
                      <BellRing className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{notif.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notif.body}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeAgo(notif.createdAt.toDate())}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );

              return notif.href ? (
                <Link href={notif.href} key={notif.id} className="block">
                  {notifCard}
                </Link>
              ) : (
                notifCard
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 border-2 border-dashed rounded-lg mt-8">
            <BellRing className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-4 font-medium text-muted-foreground">
              No notifications yet
            </p>
            <p className="text-sm text-muted-foreground">
              We&apos;ll let you know when something important happens.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
