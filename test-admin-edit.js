// Test script to verify admin functionality
// Run this in the browser console after logging in as admin

async function testAdminClubEdit() {
  console.log('Testing admin club edit functionality...');
  
  try {
    // Get the first club
    const response = await fetch('/api/clubs');
    if (!response.ok) {
      console.error('Failed to fetch clubs:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('Clubs data:', data);
    
    if (data.clubs && data.clubs.length > 0) {
      const firstClub = data.clubs[0];
      console.log('First club:', firstClub);
      
      // Try to update the club
      const updateResponse = await fetch(`/api/admin/clubs/${firstClub.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: firstClub.name + ' (Updated)',
          description: firstClub.description,
          department: firstClub.department,
          status: firstClub.status || 'ACTIVE',
          foundedYear: firstClub.foundedYear || 2020
        }),
      });
      
      if (updateResponse.ok) {
        const updatedClub = await updateResponse.json();
        console.log('Successfully updated club:', updatedClub);
      } else {
        console.error('Failed to update club:', updateResponse.status, updateResponse.statusText);
        const errorText = await updateResponse.text();
        console.error('Error details:', errorText);
      }
    } else {
      console.log('No clubs found');
    }
  } catch (error) {
    console.error('Error in test:', error);
  }
}

// Run the test
testAdminClubEdit();
