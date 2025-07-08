"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Club } from "@prisma/client";

export default function DiscoverClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchClubs = async () => {
        try {
          setLoading(true);
          const res = await fetch("/api/clubs");
          if (!res.ok) {
            throw new Error("Failed to fetch clubs. Please try again later.");
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
      setLoading(false);
    }
  }, [status]);

  const handleJoinClub = (clubId: string) => {
    console.log(`Joining club ${clubId}`);
    // Implement join club logic here
  };

  if (loading) {
    return <div className="text-center">Loading clubs...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center">
        Please sign in to view and join clubs.
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Clubs</h1>
      {clubs.length === 0 ? (
        <p>No clubs found. Please check back later.</p>
      ) : (
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
                <p className="text-gray-600 mb-4">{club.description}</p>
                <Button onClick={() => handleJoinClub(club.id)}>
                  Request to Join
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
