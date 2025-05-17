import { useEffect, useRef, useState } from 'react';
import Filters from './Filters';
import { useUser } from "../types/user";
import { FilterRegular } from '@fluentui/react-icons';
import './taskpanel.css';

type FilterState = {
    searchTerm: string;
    showCompleted: boolean;
    showStarred: boolean;
    showScheduledForLater: boolean;
    selectedPriority: 'Low' | 'Medium' | 'High' | undefined;
    showDueDate: 'Overdue' | 'Upcoming' | 'All';
};

type FilterAction =
    | { type: 'SET_SEARCH_TERM'; payload: string }
    | { type: 'SET_COMPLETED'; payload: boolean }
    | { type: 'SET_STARRED'; payload: boolean }
    | { type: 'SET_SCHEDULED'; payload: boolean }
    | { type: 'SET_PRIORITY'; payload: 'Low' | 'Medium' | 'High' | undefined }
    | { type: 'SET_DUE_DATE'; payload: 'Overdue' | 'Upcoming' | 'All' };

type TaskPanelProps = {
    dispatch: React.Dispatch<FilterAction>;
    onToggleFilters: () => void;
    onCloseFilters: () => void;
    showFilters: boolean;
    onFiltersChange: (filterValues: any) => void;
};

export default function TaskPanel({
    dispatch,
    onToggleFilters,
    onCloseFilters,
    showFilters,
    onFiltersChange,
}: TaskPanelProps) {
    const { user } = useUser();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isMounted, setIsMounted] = useState(showFilters);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (showFilters) {
            setIsMounted(true);
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            const timeout = setTimeout(() => setIsMounted(false), 350);
            return () => clearTimeout(timeout);
        }
    }, [showFilters]);

    const handleFiltersChange = (filterValues: FilterState) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: filterValues.searchTerm });
        dispatch({ type: 'SET_COMPLETED', payload: filterValues.showCompleted });
        dispatch({ type: 'SET_STARRED', payload: filterValues.showStarred });
        dispatch({ type: 'SET_SCHEDULED', payload: filterValues.showScheduledForLater });
        dispatch({ type: 'SET_PRIORITY', payload: filterValues.selectedPriority });
        dispatch({ type: 'SET_DUE_DATE', payload: filterValues.showDueDate });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onCloseFilters();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [onCloseFilters]);

    const userName = user ? user.displayName : 'Guest';

    return (
        <div className="task-panel">
            <div className="welcome-msg">
                <h4>Welcome, {userName}</h4>
            </div>
            <div className="panel">
                <h4>My Tasks...</h4>
                <div className="filter">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFilters();
                        }}
                        className="filter-btn"
                        title="Filter Tasks"
                    >
                        <FilterRegular className="filter-icon" />
                    </button>

                    {isMounted && (
                        <div
                            ref={dropdownRef}
                            className={`filter-dropdown-wrapper ${isVisible ? 'show' : 'hide'}`}
                        >
                            <div className="filter-dropdown">
                                <Filters onFiltersChange={handleFiltersChange} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
