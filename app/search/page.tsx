import { Navigation } from "@/components/navigation";
import { GlobalSearch } from "@/components/search/global-search";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Global Search</h1>
          <p className="text-muted-foreground">Search across all your content, projects, and files</p>
        </div>

        <GlobalSearch />
      </main>

      <Navigation />
    </div>
  );
}
