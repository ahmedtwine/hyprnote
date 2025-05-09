import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";

import "../src/globals.css";
import "@hypr/ui/globals.css";

initialize();

const preview: Preview = {
  loaders: [mswLoader],
};

export default preview;
