import type { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { TabGroup, Panel } from "./tab";

const config: Meta = {
	title: "TabGroup",
	component: TabGroup,
};

const TabStory: StoryFn<typeof TabGroup> = () => {
	return (
		<TabGroup titles={["First", "Second"]}>
			<Panel title="First">
				<p>Lorem ipsum</p>
			</Panel>
			<Panel title="Second">
				<p>Lorem ipsum dolor sic amet</p>
			</Panel>
			<Panel title="Third">
				<p>Adequiscing sic amet</p>
			</Panel>
		</TabGroup>
	);
};

export default config;
export { TabStory as Tab };
