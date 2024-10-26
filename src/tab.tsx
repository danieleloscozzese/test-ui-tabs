import React, { type FC, type PropsWithChildren, useState } from "react";
import ownClasses from "./tab.module.css";

type PanelProps = PropsWithChildren<{ title: string }>;

/**
 * A transparent component that provides the necessary props to render a tab
 * and its content.
 */
const Panel: FC<PanelProps> = ({ children }) => children;

interface TabGroupProps {
	titles: string[];
	children: React.ReactElement<PanelProps, typeof Panel>[];
}

/**
 * Warns if there are non-unique titles in the collection.
 * The component does not have logic to deduplicate titles, since they should
 * not be used.
 * If they are, the navigation will not work (due to the `key` duplication)
 * but this is intentional: tabs should have unique names in order to be
 * differentiated by the user.
 * No error is thrown so that whichever content is valid is rendered as usual.
 */
const validateTitles = (titles: string[]) => {
	const uniqueTitles = new Set(titles.map((t) => t.toLocaleLowerCase()));

	if (titles.length > uniqueTitles.size) {
		console.group("[Tabs]");
		console.warn(
			"There are duplicated titles and the navigation will not work as intended.",
		);
		console.warn(
			"Ensure that the tab titles are unique for accessibility and React performance.",
		);
		console.groupEnd();
	}
};

const TabGroup: FC<TabGroupProps> = ({ children }) => {
	const titles = new Array(children.length),
		panelContents = new Array(children.length);

	children.forEach(({ props: { title, children: panel } }, index) => {
		titles[index] = title;
		panelContents[index] = panel;
	});

	validateTitles(titles);

	const [activeTabIndex, setActiveTabIndex] = useState(0);

	const tabs = titles.map((title, index) => {
		return (
			<li key={title} role="tab" className={ownClasses.tab}>
				<button
					type="button"
					onClick={() => {
						setActiveTabIndex(index);
					}}
					tabIndex={index === activeTabIndex ? 0 : -1}
					onKeyDown={(evt) => {
						const containingTabList =
							evt.currentTarget.parentElement?.parentElement;

						if (containingTabList?.role !== "tablist") {
							throw new Error("Broken structure, unable to proceed");
						}

						const tabButtons: NodeListOf<HTMLButtonElement> =
							containingTabList.querySelectorAll('[role="tab"] button');

						switch (evt.key) {
							case "ArrowRight":
								if (index + 1 < tabButtons.length) {
									tabButtons[index + 1].focus();
								}
								return;
							case "ArrowLeft":
								if (index > 0) {
									tabButtons[index - 1].focus();
								}
								return;
							case "Home":
								tabButtons[0].focus();
								return;
							case "End":
								tabButtons[tabButtons.length - 1].focus();
								return;
						}
					}}
				>
					{title}
				</button>
			</li>
		);
	});

	const panels = children.map((panel, index) => {
		return (
			<section
				key={titles[index]}
				role="tabpanel"
				hidden={index !== activeTabIndex}
				className={ownClasses.panel}
			>
				{panel}
			</section>
		);
	});

	return (
		<div className={ownClasses.tabGroup}>
			<ol role="tablist" className={ownClasses.tabList}>
				{tabs}
			</ol>

			{panels}
		</div>
	);
};

export default TabGroup;
export { Panel, TabGroup };
