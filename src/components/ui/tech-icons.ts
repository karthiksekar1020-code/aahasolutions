/** Technology names used in the "Technology Stack" chips -> logo files in /public/icon. First two distinct matches are shown. */
const RULES: [RegExp, string][] = [
  [/next\.?js/i, 'nextjs.svg'],
  [/react/i, 'react_js.svg'],
  [/node/i, 'node_js.svg'],
  [/express/i, 'tech-express.svg'],
  [/laravel|php/i, 'laravel.svg'],
  [/mysql/i, 'tech-mysql.svg'],
  [/postgres|postgis|timescale/i, 'tech-postgresql.svg'],
  [/redis/i, 'tech-redis.svg'],
  [/oracle/i, 'tech-oracle.svg'],
  [/java\b|spring/i, 'springboot.svg'],
  [/\.net|c#/i, 'dotnet.svg'],
  [/angular/i, 'angular-js.svg'],
  [/vue/i, 'tech-vuedotjs.svg'],
  [/python|django/i, 'python.svg'],
  [/pytorch/i, 'pytorch.svg'],
  [/tensorflow/i, 'tensorflow.svg'],
  [/openai/i, 'openai.svg'],
  [/stripe/i, 'tech-stripe.svg'],
  [/razorpay/i, 'tech-razorpay.svg'],
  [/shopify/i, 'tech-shopify.svg'],
  [/woocommerce/i, 'tech-woocommerce.svg'],
  [/magento/i, 'tech-magento.svg'],
  [/firebase/i, 'tech-firebase.svg'],
  [/graphql/i, 'tech-graphql.svg'],
  [/terraform/i, 'tech-terraform.svg'],
  [/docker/i, 'docker.svg'],
  [/kubernetes|eks/i, 'kubernetes.svg'],
  [/google cloud/i, 'brand-googlecloud.svg'],
  [/azure/i, 'brand-azure.svg'],
  [/aws/i, 'brand-aws.svg'],
  [/google maps/i, 'tech-googlemaps.svg'],
  [/mapbox/i, 'tech-mapbox.svg'],
  [/openstreetmap/i, 'tech-openstreetmap.svg'],
  [/twilio/i, 'tech-twilio.svg'],
  [/zoom/i, 'tech-zoom.svg'],
  [/kotlin/i, 'kotlin.svg'],
  [/swift/i, 'swift.svg'],
  [/html5/i, 'html5.webp'],
  [/css3/i, 'css3.svg'],
];

export function techIcons(label: string): string[] {
  const out: string[] = [];
  for (const [re, file] of RULES) {
    if (re.test(label) && !out.includes(file)) out.push(file);
    if (out.length === 2) break;
  }
  return out;
}
