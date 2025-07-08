"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Club } from "@prisma/client";

// Add a type for the club with membership status
interface ClubWithMembership extends Club {
  membershipStatus?: string | null;
}

export default function DiscoverClubsPage() {
  // Define types for API responses
  interface ClubsApiResponse {
    clubs: ClubWithMembership[];
    count?: number;
    message?: string;
  }

  const [clubs, setClubs] = useState<ClubWithMembership[]>([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingClubIds, setProcessingClubIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchClubs() {
      try {
        setLoading(true);
        
        // Temporarily using the backup endpoint
        console.log("Fetching clubs data from backup endpoint...");
        const response = await fetch("/api/all-clubs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Prevent caching to get fresh data
            "Cache-Control": "no-cache, no-store"
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error fetching clubs:", response.status, errorText);
          throw new Error(`Failed to fetch clubs: ${response.status}`);
        }
        
        // Parse the response JSON
        const data = await response.json();
        console.log("API response:", data);
        
        // Check if data has clubs property
        if (data && Array.isArray(data.clubs)) {
          setClubs(data.clubs);
        } else if (Array.isArray(data)) {
          // Handle case where API returns array directly
          setClubs(data);
        } else {
          console.error("Unexpected API response format:", data);
          setError("Unexpected data format from API");
          setClubs([]);
        }
      } catch (err) {
        console.error("Error in fetchClubs:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching clubs");
        }
        setClubs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchClubs();
  }, []);

  const handleJoinClub = async (clubId: string) => {
    // Clear any previous errors
    setError(null);
    
    if (status !== "authenticated") {
      setError("You must be signed in to join a club.");
      return;
    }
    
    // Add club ID to processing set to prevent multiple clicks
    setProcessingClubIds(prev => new Set(prev).add(clubId));
    
    try {
      console.log("Sending join request for club ID:", clubId);
      const res = await fetch("/api/memberships", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Prevent caching
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify({ 
          clubId
          // action: "join" is now the default in the API
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error("Join club error:", data);
        throw new Error(data.error || "Failed to send join request.");
      }
      
      console.log("Join request successful:", data);

      // Update the UI to reflect the pending status
      setClubs((prevClubs) =>
        prevClubs.map((club) =>
          club.id === clubId
            ? { ...club, membershipStatus: "PENDING" }
            : club
        )
      );
      
      // Show success message
      alert("Your club join request has been submitted successfully!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while joining the club.");
      }
    } finally {
      // Remove club ID from processing set when done
      setProcessingClubIds(prev => {
        const updated = new Set(prev);
        updated.delete(clubId);
        return updated;
      });
    }
  };

  if (status === "loading") {
    return <div className="text-center py-8">Loading session...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Clubs</h1>
      {loading && <div className="text-center py-4">Loading clubs...</div>}
      {error && <div className="text-center text-red-500 py-4 bg-red-50 rounded-md mb-4 p-3">{error}</div>}
      {!loading && clubs.length === 0 && (
        <p>
          No clubs found. This might be because the database hasn't been seeded
          yet.
        </p>
      )}
      {clubs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Card key={club.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{club.name}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {club.category && (
                    <Badge variant="outline">{club.category}</Badge>
                  )}
                  {club.department && (
                    <Badge variant="secondary">{club.department}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-gray-600 mb-4 h-24 overflow-y-auto">
                  {club.description}
                </p>
                <Button
                  onClick={() => handleJoinClub(club.id)}
                  disabled={
                    status !== "authenticated" ||
                    processingClubIds.has(club.id)
                  }
                  className="mt-4"
                >
                  {status !== "authenticated"
                    ? "Sign in to Join"
                    : processingClubIds.has(club.id)
                    ? "Processing..."
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
