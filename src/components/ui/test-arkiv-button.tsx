"use client";

export function TestArkivButton() {
  async function handleTest() {
    console.log("Testing Arkiv API...");

    try {
      const response = await fetch("/api/arkiv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: "Test from button click!",
          contentType: "text/plain",
          attributes: [{ key: "type", value: "test" }],
          expiresIn: 120,
        }),
      });

      const data = await response.json();

      console.log("✅ Arkiv API Response:", data);

      if (data.success) {
        console.log("Entity Key:", data.entityKey);
        console.log("Data:", data.data);
        console.log("Transaction Hash:", data.txHash);
      } else {
        console.error("❌ Error:", data.error);
      }
    } catch (error) {
      console.error("❌ Failed to call Arkiv API:", error);
    }
  }

  async function handleRetrieveDatabase() {
    console.log("Retrieving Arkiv database...");

    try {
      const response = await fetch("/api/arkiv?database=true", {
        method: "GET",
      });

      const data = await response.json();

      console.log("=".repeat(80));
      console.log("📦 ARKIV DATABASE RETRIEVED");
      console.log("=".repeat(80));
      console.log(`Total entries: ${data.totalEntries}`);
      console.log("=".repeat(80));
      console.log(JSON.stringify(data.database, null, 2));
      console.log("=".repeat(80));

      if (data.success) {
        console.log("✅ Database retrieved successfully!");
        if (data.totalEntries === 0) {
          console.log("ℹ️ Database is empty. Create some inheritances first!");
        }
      } else {
        console.error("❌ Error:", data.error);
      }
    } catch (error) {
      console.error("❌ Failed to retrieve database:", error);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={handleTest}
        className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Test Arkiv API
      </button>
      <button
        onClick={handleRetrieveDatabase}
        className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
      >
        Get Database
      </button>
    </div>
  );
}
