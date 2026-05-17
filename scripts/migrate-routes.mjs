import fs from "fs";
import path from "path";

const routesDir = "src/routes";
const pagesDir = "src/pages";

const map = {
  "index.tsx": "home-page.tsx",
  "about.tsx": "about-page.tsx",
  "properties.tsx": "properties-page.tsx",
  "properties.$id.tsx": "property-detail-page.tsx",
  "contact.tsx": "contact-page.tsx",
  "careers.tsx": "careers-page.tsx",
  "login.tsx": "login-page.tsx",
  "dashboard.tsx": "dashboard-page.tsx",
  "admin.login.tsx": "admin-login-page.tsx",
  "admin.index.tsx": "admin-dashboard-page.tsx",
  "admin.properties.tsx": "admin-properties-page.tsx",
  "admin.enquiries.tsx": "admin-enquiries-page.tsx",
  "admin.careers.tsx": "admin-careers-page.tsx",
  "admin.users.tsx": "admin-users-page.tsx",
};

fs.mkdirSync(pagesDir, { recursive: true });

for (const [src, dest] of Object.entries(map)) {
  let content = fs.readFileSync(path.join(routesDir, src), "utf8");

  content = content.replace(/^import.*@tanstack\/react-router.*\n/gm, "");
  content = content.replace(
    /export const Route = createFileRoute\([\s\S]*?\);\n\n/g,
    ""
  );
  content = content.replace(
    /export const Route = createFileRoute\([\s\S]*?\)\(\{[\s\S]*?\}\);\n\n/g,
    ""
  );

  if (!content.includes('import Link from "next/link"')) {
    if (content.includes("<Link") || content.includes("Link ")) {
      content = 'import Link from "next/link";\n' + content;
    }
  }

  if (content.includes("useRouter") && !content.includes("next/navigation")) {
    content = content.replace(
      /^(import.*\n)*/,
      (m) => m + 'import { useRouter } from "next/navigation";\n'
    );
  }

  if (content.includes("Route.useParams")) {
    if (!content.includes("useParams")) {
      content =
        'import { useParams } from "next/navigation";\n' + content;
    }
    content = content.replace(/Route\.useParams\(\)/g, "useParams()");
    content = content.replace(
      /const \{ id: slug \} = useParams\(\);/,
      'const params = useParams();\n  const slug = params.id as string;'
    );
  }

  if (content.includes("notFound()") && content.includes("throw notFound")) {
    content = 'import { notFound } from "next/navigation";\n' + content;
    content = content.replace(/throw notFound\(\)/g, "notFound()");
  }

  content = content.replace(/router\.navigate\(\{ to: "([^"]+)" \}\)/g, 'router.push("$1")');
  content = content.replace(/router\.navigate\(\{ to: '([^']+)' \}\)/g, "router.push('$1')");

  content = content.replace(/<Link\s+to="([^"]+)"/g, '<Link href="$1"');
  content = content.replace(/<Link\s+to='([^']+)'/g, "<Link href='$1'");
  content = content.replace(/<Link\s+to=\{([^}]+)\}/g, "<Link href={$1}");
  content = content.replace(/\s+activeProps=\{[^}]+\}/g, "");
  content = content.replace(/\s+activeOptions=\{[^}]+\}/g, "");
  content = content.replace(/\s+params=\{\{[^}]+\}\}/g, "");
  content = content.replace(/to=\{to as any\}/g, "href={to}");

  const fnMatch = content.match(/function (\w+)\(\)/);
  if (fnMatch) {
    const fnName = fnMatch[1];
    if (!content.includes(`export default ${fnName}`)) {
      content += `\nexport default ${fnName};\n`;
    }
  }

  if (!content.startsWith('"use client"')) {
    content = '"use client";\n\n' + content;
  }

  fs.writeFileSync(path.join(pagesDir, dest), content);
  console.log("Wrote", dest);
}
