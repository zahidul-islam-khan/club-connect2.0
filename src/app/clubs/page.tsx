"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Club } from "@prisma/client";

// Add a type for the club with membership status
interface ClubWithMembership extends Club {
  membershipStatus?: "PENDING" | "ACTIVE" | "INACTIVE" | "NONE";
}

export default function DiscoverClubsPage() {
  const [clubs, setClubs] = useState<ClubWithMembership[]>([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch clubs if the session is authenticated
    if (status === "authenticated") {
      const fetchClubs = async () => {
        try {
          setLoading(true);
          // The fetch request will automatically include the user's session cookie
          const res = await fetch("/api/clubs");
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to fetch clubs.");
          }
          const data = await res.json();
          setClubs(data);
          setError(null);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchClubs();
    } else if (status === "unauthenticated") {
      // If the user is not logged in, don't try to load clubs.
      setLoading(false);
      setClubs([]); // Clear any existing clubs
    }
    // The dependency array is correct. The effect should re-run when the session status changes.
  }, [status]);

  const handleJoinClub = async (clubId: string) => {
    if (status !== "authenticated") {
      setError("You must be signed in to join a club.");
      return;
    }
    try {
      const res = await fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send join request.");
      }

      // Update the UI to reflect the pending status
      setClubs((prevClubs) =>
        prevClubs.map((club) =>
          club.id === clubId
            ? { ...club, membershipStatus: "PENDING" }
            : club
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while joining the club.");
      }
    }
  };

  if (status === "loading") {
    return <div className="text-center">Loading session...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Clubs</h1>
      {status === "unauthenticated" && (
        <div className="text-center p-4 border rounded-md bg-gray-50">
          <p>Please sign in to view and join university clubs.</p>
        </div>
      )}
      {loading && <div className="text-center">Loading clubs...</div>}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}
      {status === "authenticated" && !loading && clubs.length === 0 && (
        <p>
          No clubs found. This might be because the database hasn't been seeded
          yet.
        </p>
      )}
      {status === "authenticated" && clubs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Card key={club.id}>
              <CardHeader>
                <CardTitle>{club.name}</CardTitle>
                {club.department && (
                  <Badge variant="secondary">{club.department}</Badge>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 h-24 overflow-y-auto">
                  {club.description}
                </p>
                <Button
                  onClick={() => handleJoinClub(club.id)}
                  disabled={
                    club.membershipStatus === "ACTIVE" ||
                    club.membershipStatus === "PENDING"
                  }
                >
                  {club.membershipStatus === "ACTIVE"
                    ? "Already a Member"
                    : club.membershipStatus === "PENDING"
                    ? "Request Sent"
                    : "Request to Join"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
