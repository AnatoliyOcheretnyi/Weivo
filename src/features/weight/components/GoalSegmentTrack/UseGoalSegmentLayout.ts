import { Dimensions } from 'react-native';
import { useMemo } from 'react';

import type { GoalSegment } from '../../data/goal-segments/types';
import {
  GOAL_SEGMENT_DEFAULT_WIDTH_OFFSET,
  GOAL_SEGMENT_DOT_SIZE,
  GOAL_SEGMENT_GAP,
  GOAL_SEGMENT_LINE_WIDTH,
  GOAL_SEGMENT_MIN_ITEMS_PER_ROW,
  GOAL_SEGMENT_ROW_GAP,
} from './GoalSegmentTrackConstants';

type GoalSegmentNode = {
  id: string;
  value: number | null;
  segmentIndex: number | null;
  segment?: GoalSegment;
  type: 'start' | 'segment' | 'add';
};

type GoalSegmentPoint = {
  id: string;
  segment?: GoalSegment;
  segmentIndex: number | null;
  value: number | null;
  type: 'start' | 'segment' | 'add';
  index: number;
  row: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
};

type UseGoalSegmentLayoutParams = {
  segments: GoalSegment[];
  currentKg?: number;
  showAddNode: boolean;
  containerWidth: number;
};

type UseGoalSegmentLayoutResult = {
  ordered: GoalSegment[];
  nodes: GoalSegmentNode[];
  points: GoalSegmentPoint[];
  height: number;
  availableWidth: number;
  itemsPerRow: number;
};

export const useGoalSegmentLayout = ({
  segments,
  currentKg,
  showAddNode,
  containerWidth,
}: UseGoalSegmentLayoutParams): UseGoalSegmentLayoutResult => {
  const ordered = useMemo(
    () => [...segments].sort((a, b) => a.createdAtISO.localeCompare(b.createdAtISO)),
    [segments]
  );

  const availableWidth =
    containerWidth || Dimensions.get('window').width - GOAL_SEGMENT_DEFAULT_WIDTH_OFFSET;
  const itemWidth = GOAL_SEGMENT_DOT_SIZE + GOAL_SEGMENT_LINE_WIDTH + GOAL_SEGMENT_GAP;
  const itemsPerRow = Math.max(
    GOAL_SEGMENT_MIN_ITEMS_PER_ROW,
    Math.floor((availableWidth + GOAL_SEGMENT_GAP) / itemWidth)
  );

  const nodes = useMemo<GoalSegmentNode[]>(() => {
    if (ordered.length === 0 && !showAddNode) {
      return [];
    }
    const startValue =
      ordered.length > 0
        ? ordered[0].startKg
        : currentKg != null
          ? currentKg
          : 0;
    const baseNodes: GoalSegmentNode[] = [
      {
        id: ordered.length > 0 ? `start-${ordered[0].id}` : 'start',
        value: startValue,
        segmentIndex: null,
        type: 'start',
      },
      ...ordered.map((segment, index) => ({
        id: segment.id,
        value: segment.targetKg,
        segmentIndex: index,
        segment,
        type: 'segment' as const,
      })),
    ];

    if (!showAddNode) {
      return baseNodes;
    }

    return [
      ...baseNodes,
      {
        id: 'add',
        value: null,
        segmentIndex: null,
        type: 'add',
      },
    ];
  }, [currentKg, ordered, showAddNode]);

  const rowCount = Math.max(1, Math.ceil(nodes.length / itemsPerRow));
  const height = rowCount * GOAL_SEGMENT_DOT_SIZE + (rowCount - 1) * GOAL_SEGMENT_ROW_GAP;

  const points = useMemo<GoalSegmentPoint[]>(() => {
    return nodes.map((node, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      const isReversed = row % 2 === 1;
      const x = isReversed
        ? availableWidth - GOAL_SEGMENT_DOT_SIZE - col * itemWidth
        : col * itemWidth;
      const y = row * (GOAL_SEGMENT_DOT_SIZE + GOAL_SEGMENT_ROW_GAP);
      return {
        id: node.id,
        segment: node.segment,
        segmentIndex: node.segmentIndex,
        value: node.value,
        type: node.type,
        index,
        row,
        x,
        y,
        cx: x + GOAL_SEGMENT_DOT_SIZE / 2,
        cy: y + GOAL_SEGMENT_DOT_SIZE / 2,
      };
    });
  }, [availableWidth, itemsPerRow, itemWidth, nodes]);

  return {
    ordered,
    nodes,
    points,
    height,
    availableWidth,
    itemsPerRow,
  };
};
