"use client";

import { useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/firebase/config";
import { toast } from "sonner";
import { BellRing } from "lucide-react";

export function RealtimeNotifier() {
  const { user } = useAuth();
  const [mountTime] = useState(() => Timestamp.now());

  useEffect(() => {
    // Only set up listener if user is fully authenticated
    if (user && user.uid && user.emailVerified !== false) {
      // Add a small delay to ensure auth token is ready
      const timer = setTimeout(() => {
        const notificationsRef = collection(
          db,
          "users",
          user.uid,
          "notifications"
        );

        const q = query(notificationsRef, where("createdAt", ">", mountTime));

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const data = change.doc.data();
                toast(data.title, {
                  description: data.body,
                  icon: <BellRing className="h-4 w-4" />,
                });
              }
            });
          },
          (error) => {
            console.error("Error listening to notifications:", error);
            // Silently fail - don't show error to user for notifications
          }
        );

        return () => unsubscribe();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user, mountTime]);

  return null;
}
