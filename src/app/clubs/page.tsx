"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Discover Clubs</h1>
        <p className="text-gray-600 mt-2">Explore and join BRAC University clubs</p>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading clubs...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center text-red-500 py-4 bg-red-50 rounded-md mb-6 p-4 mx-4 sm:mx-0">
          <p className="font-medium">Error loading clubs</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
      
      {!loading && clubs.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No clubs found. The database might need to be seeded.</p>
        </div>
      )}
      
      {clubs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {clubs.map((club) => (
            <Card key={club.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
              {club.logoUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
                  <img
                    src={club.logoUrl}
                    alt={`${club.name} logo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg leading-tight">
                  {club.name}
                </CardTitle>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {club.category && (
                    <Badge variant="outline" className="text-xs">
                      {club.category}
                    </Badge>
                  )}
                  {club.department && (
                    <Badge variant="secondary" className="text-xs">
                      {club.department}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between pt-0">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                  {club.description}
                </p>
                <Button
                  onClick={() => handleJoinClub(club.id)}
                  disabled={
                    status !== "authenticated" ||
                    processingClubIds.has(club.id)
                  }
                  className="w-full text-sm"
                  size="sm"
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
