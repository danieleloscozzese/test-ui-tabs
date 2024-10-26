import type { Meta, StoryFn } from "@storybook/react";
import { TabGroup, Panel } from "./tab-group";

const config: Meta = {
  title: "TabGroup",
  component: TabGroup,
};

const TabStory: StoryFn<typeof TabGroup> = () => {
  return (
    <TabGroup accessibleTitle="Example tab group">
      <Panel title="First">
        <p>The default data that will be shown on arrival</p>
      </Panel>
      <Panel title="Second">
        <p>The content of another tab</p>
      </Panel>
      <Panel title="Third">
        <p>
          Yet <em>more</em> content.
        </p>
        <p>This time there&apos;s more than before.</p>
      </Panel>
      <Panel
        title={{
          label: "Fourth",
          badge: {
            variant: "positive",
            children: "New",
          },
        }}
      >
        <p>
          Yet <em>more</em> content.
        </p>
        <p>This time there&apos;s more than before.</p>
      </Panel>
    </TabGroup>
  );
};

export default config;
export { TabStory as Tab };
