import React, { type FC, type PropsWithChildren, useId, useState } from "react";
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

const handleTabKeyDown = (
	evt: React.KeyboardEvent<HTMLButtonElement>,
	index: number,
) => {
	const containingTabList = evt.currentTarget.parentElement?.parentElement;

	if (containingTabList?.role !== "tablist") {
		throw new Error("Broken structure, unable to proceed");
	}

	const tabButtons: NodeListOf<HTMLButtonElement> =
		containingTabList.querySelectorAll('[role="tab"] button');

	// TODO autoswitch with an override
	if (evt.key === "Home" || (evt.key === "ArrowLeft" && evt.metaKey)) {
		tabButtons[0].focus();
	} else if (evt.key === "End" || (evt.key === "ArrowRight" && evt.metaKey)) {
		tabButtons[tabButtons.length - 1].focus();
	} else if (evt.key === "ArrowRight") {
		if (index + 1 < tabButtons.length) {
			tabButtons[index + 1].focus();
		} else {
			tabButtons[0].focus();
		}
	} else if (evt.key === "ArrowLeft") {
		if (index > 0) {
			tabButtons[index - 1].focus();
		} else {
			tabButtons[tabButtons.length - 1].focus();
		}
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
	const pairIds: { tabId: string; panelId: string }[] = new Array(
		children.length,
	);

	const tabs = titles.map((title, index) => {
		const tabId = useId();
		const panelId = useId();
		pairIds[index] = { tabId, panelId };

		const isSelected = index === activeTabIndex;

		return (
			<li
				key={title}
				role="tab"
				className={ownClasses.tab}
				aria-selected={isSelected}
				id={tabId}
				aria-controls={panelId}
			>
				<button
					type="button"
					onClick={() => {
						setActiveTabIndex(index);
					}}
					tabIndex={isSelected ? 0 : -1}
					onKeyDown={(evt) => handleTabKeyDown(evt, index)}
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
				tabIndex={index === activeTabIndex ? 0 : undefined}
				className={ownClasses.panel}
				aria-labelledby={pairIds[index].tabId}
				id={pairIds[index].panelId}
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
