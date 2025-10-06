export async function fetchAnimals() {
  try {
    const response = await fetch("http://localhost:3000/api/animals");
    if (!response.ok) throw new Error("Failed to load animals from API");
    const data = await response.json();
    console.log("✅ Fetched animals from API:", data);
    return data;
  } catch (err) {
    console.error("Error fetching animals:", err);
    return []; // fallback to empty array
  }
}
