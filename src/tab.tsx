import React, { type FC, type PropsWithChildren, useId, useState } from "react";
import ownClasses from "./tab.module.css";

type PanelProps = PropsWithChildren<{ title: string }>;

/**
 * A transparent component that provides the necessary props to render a tab
 * and its content.
 */
const Panel: FC<PanelProps> = ({ children }) => children;

interface TabGroupProps {
	accessibleTitle: string;
	withManualSwitching?: boolean;
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
		// Loop back to the start if the focus is at the end
		if (index + 1 < tabButtons.length) {
			tabButtons[index + 1].focus();
		} else {
			tabButtons[0].focus();
		}
	} else if (evt.key === "ArrowLeft") {
		if (index > 0) {
			tabButtons[index - 1].focus();
		}
		// Loop around to the end if the focus is at the start
		else {
			tabButtons[tabButtons.length - 1].focus();
		}
	}
};

const TabGroup: FC<TabGroupProps> = ({
	accessibleTitle,
	children,
	// withManualSwitching = false,
}) => {
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
				id={tabId}
				aria-controls={panelId}
				aria-selected={isSelected}
			>
				<button
					type="button"
					onClick={() => {
						setActiveTabIndex(index);
					}}
					onKeyDown={(evt) => handleTabKeyDown(evt, index)}
					tabIndex={isSelected ? 0 : -1}
				>
					{title}
				</button>
			</li>
		);
	});

	const panels = children.map((panel, index) => {
		const isSelected = index === activeTabIndex;

		return (
			<section
				key={titles[index]}
				role="tabpanel"
				className={ownClasses.panel}
				hidden={!isSelected}
				tabIndex={isSelected ? 0 : undefined}
				aria-labelledby={pairIds[index].tabId}
				id={pairIds[index].panelId}
			>
				{panel}
			</section>
		);
	});

	return (
		<div>
			<ol
				role="tablist"
				className={ownClasses.tabList}
				aria-label={accessibleTitle}
			>
				{tabs}
			</ol>

			{panels}
		</div>
	);
};

export default TabGroup;
export { Panel, TabGroup };
