'use client';

import * as React from 'react';
import type {
	ChatConversation,
	ChatMessage as ChatMessageType,
} from '../../core/message-types';
import type { ThinkingLevel } from '../../core/thinking-levels';
import { useMessageSelection } from '../hooks/useMessageSelection';
import { ChatContainer } from './ChatContainer';
import { ChatExportToolbar } from './ChatExportToolbar';
import { ChatMessage } from './ChatMessage';
import type {
	ChatMessageComponents,
	SuggestionComponents,
} from './component-types';
import { Suggestion, Suggestions } from './Suggestion';
import { ThinkingLevelPicker } from './ThinkingLevelPicker';

export interface ChatWithExportProps {
	messages: ChatMessageType[];
	conversation?: ChatConversation | null;
	children?: React.ReactNode;
	className?: string;
	/** Show export toolbar */
	showExport?: boolean;
	/** Show message selection checkboxes */
	showMessageSelection?: boolean;
	/** Show scroll-to-bottom button */
	showScrollButton?: boolean;
	/** New conversation callback */
	onCreateNew?: () => void;
	/** Fork conversation callback */
	onFork?: (upToMessageId?: string) => Promise<string | null>;
	/** Edit message callback */
	onEditMessage?: (messageId: string, newContent: string) => Promise<void>;
	/** Thinking level (instant, thinking, extra_thinking, max) */
	thinkingLevel?: ThinkingLevel;
	/** Called when thinking level changes */
	onThinkingLevelChange?: (level: ThinkingLevel) => void;
	/** Host-provided renderer for tool results with presentationKey */
	presentationRenderer?: (key: string, data?: unknown) => React.ReactNode;
	/** Host-provided renderer for tool results with formKey */
	formRenderer?: (
		key: string,
		defaultValues?: Record<string, unknown>
	) => React.ReactNode;
	/** Host-provided renderer for tool results with dataViewKey */
	dataViewRenderer?: (key: string, items?: unknown[]) => React.ReactNode;
	/** Override components for ChatMessage (Reasoning, Sources, ChainOfThought) */
	components?: ChatMessageComponents;
	/** Clickable suggestion chips (e.g. empty state) */
	suggestions?: string[];
	/** Called when a suggestion is clicked */
	onSuggestionClick?: (suggestion: string) => void;
	/** Override Suggestion components */
	suggestionComponents?: SuggestionComponents;
	/** Show suggestions when no messages (default true when suggestions provided) */
	showSuggestionsWhenEmpty?: boolean;
}

/**
 * Chat container with export and message selection.
 * Composes ChatContainer, ChatExportToolbar, and useMessageSelection.
 */
export function ChatWithExport({
	messages,
	conversation,
	children,
	className,
	showExport = true,
	showMessageSelection = true,
	showScrollButton = true,
	onCreateNew,
	onFork,
	onEditMessage,
	thinkingLevel = 'thinking',
	onThinkingLevelChange,
	presentationRenderer,
	formRenderer,
	dataViewRenderer,
	components,
	suggestions,
	onSuggestionClick,
	suggestionComponents: suggestionComps,
	showSuggestionsWhenEmpty = true,
}: ChatWithExportProps) {
	const messageIds = React.useMemo(() => messages.map((m) => m.id), [messages]);
	const selection = useMessageSelection(messageIds);

	const showSuggestions =
		suggestions &&
		suggestions.length > 0 &&
		(messages.length === 0 || showSuggestionsWhenEmpty);

	const hasToolbar = showExport || showMessageSelection;
	const hasPicker = Boolean(onThinkingLevelChange);
	const headerContent =
		hasPicker || hasToolbar ? (
			<>
				{hasPicker && onThinkingLevelChange && (
					<ThinkingLevelPicker
						value={thinkingLevel}
						onChange={onThinkingLevelChange}
						compact
					/>
				)}
				{hasToolbar && (
					<ChatExportToolbar
						messages={messages}
						conversation={conversation}
						selectedIds={selection.selectedIds}
						showSelectionSummary={showMessageSelection}
						onSelectAll={showMessageSelection ? selection.selectAll : undefined}
						onClearSelection={
							showMessageSelection ? selection.clearSelection : undefined
						}
						selectedCount={selection.selectedCount}
						totalCount={messages.length}
						onCreateNew={onCreateNew}
						onFork={onFork}
					/>
				)}
			</>
		) : null;

	return (
		<ChatContainer
			className={className}
			headerContent={headerContent}
			showScrollButton={showScrollButton}
		>
			{messages.map((msg) => (
				<ChatMessage
					key={msg.id}
					message={msg}
					selectable={showMessageSelection}
					selected={selection.isSelected(msg.id)}
					onSelect={showMessageSelection ? selection.toggle : undefined}
					editable={msg.role === 'user' && !!onEditMessage}
					onEdit={onEditMessage}
					presentationRenderer={presentationRenderer}
					formRenderer={formRenderer}
					dataViewRenderer={dataViewRenderer}
					components={components}
				/>
			))}
			{showSuggestions &&
				(() => {
					const SuggestionsComp = suggestionComps?.Suggestions;
					const SuggestionComp = suggestionComps?.Suggestion;
					if (SuggestionsComp && SuggestionComp) {
						return (
							<SuggestionsComp>
								{suggestions.map((s) => (
									<SuggestionComp
										key={s}
										suggestion={s}
										onClick={onSuggestionClick}
									/>
								))}
							</SuggestionsComp>
						);
					}
					return (
						<Suggestions className="mb-4">
							{suggestions.map((s) => (
								<Suggestion
									key={s}
									suggestion={s}
									onClick={onSuggestionClick}
								/>
							))}
						</Suggestions>
					);
				})()}
			{children}
		</ChatContainer>
	);
}
