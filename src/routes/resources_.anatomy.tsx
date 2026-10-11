import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/resources_/anatomy")({
  head: () => ({
    meta: [
      { title: "Understand the Body Mechanics Behind Movement — Physiomatics" },
    ],
  }),
  component: AnatomyPage,
});

function AnatomyPage() {
  return (
    <>
      <PageHero eyebrow="Anatomy & Learning" title="Understand the Body Mechanics Behind Movement.">
        Basic body landmarks, major joints, and the terminology used in movement analysis.
      </PageHero>

      <section className="container-page py-16 max-w-3xl mx-auto prose prose-slate dark:prose-invert">
        <h2>Basic Terminology</h2>
        <p>Understanding movement analysis begins with understanding how clinical professionals describe movement.</p>
        
        <h3>Flexion and Extension</h3>
        <ul>
          <li><strong>Flexion:</strong> Bending a joint to decrease the angle between two bones (e.g., bending your knee).</li>
          <li><strong>Extension:</strong> Straightening a joint to increase the angle (e.g., straightening your leg).</li>
        </ul>

        <h3>Shoulder Movements</h3>
        <ul>
          <li><strong>Flexion:</strong> Raising your arm forward and upward.</li>
          <li><strong>Abduction:</strong> Raising your arm out to the side.</li>
        </ul>

        <h2>2D Video vs. 3D Measurement</h2>
        <p>A true clinical measurement using a goniometer or a multi-camera 3D motion capture lab tracks your joints in three-dimensional space. Our platform uses a single webcam, which means it projects a 3D movement onto a 2D plane. This introduces perspective errors if you are not perfectly aligned with the camera, which is why our system provides <em>estimates</em> rather than clinical-grade measurements.</p>
        
        <div className="mt-8">
          <Button asChild variant="hero">
            <Link to="/platform/movement">Explore Movement Analysis</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
