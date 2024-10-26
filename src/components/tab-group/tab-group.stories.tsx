import type { Meta, StoryObj } from "@storybook/react";
import { TabGroup as Component, Panel } from "./tab-group";

const config: Meta = {
  title: "TabGroup",
  component: Component,
};

type Story = StoryObj<typeof config>;

const TabGroup: Story = {
  args: {
    accessibleTitle: "Example tab group",
    tabVariant: "pill",
    children: [
      <Panel title="First">
        <p className="body m">The default data that will be shown on arrival</p>
      </Panel>,
      <Panel title="Second">
        <p className="body m">The content of another tab</p>
      </Panel>,
      <Panel title="Third">
        <p className="body m">
          Yet <em>more</em> content.
        </p>
        <p className="body m">This time there&apos;s more than before.</p>
      </Panel>,
      <Panel
        title={{
          label: "Fourth",
          badge: {
            variant: "positive",
            children: "New",
          },
        }}
      >
        <p className="body m">And another tab</p>
        <p className="body s">(This time there&apos;s a badge.)</p>
      </Panel>,
    ],
  },
};

export default config;
export { TabGroup };
