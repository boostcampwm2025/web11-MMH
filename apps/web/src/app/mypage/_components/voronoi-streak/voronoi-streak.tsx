"use client";

import { useCanvas2D } from "@/hooks/use-canvas-2d";
import { Delaunay } from "d3-delaunay";
import { randomLcg } from "d3-random";
import * as React from "react";
import skmeans from "skmeans";
import {
  VORONOI_COLOR_CONSTANT,
  VORONOI_NUMBER_CONSTANT,
} from "../../_constants/voronoi-constant";
import computeCells from "../../_lib/compute-cells";
import generateRandomPoint from "../../_lib/generate-random-point";
import lloydRelaxation from "../../_lib/lloyd-relaxation";

interface VoronoiStreakProps {
  streakCount: number;
  imageSrc: string;
}

interface CellData {
  path: Path2D;
  color: string;
  cluster: number;
}

function VoronoiStreak({ streakCount, imageSrc }: VoronoiStreakProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { width, height } = useCanvas2D(canvasRef);
  const [cellData, setCellData] = React.useState<CellData[]>([]);

  React.useEffect(() => {
    if (!imageSrc || width === 0 || height === 0) return;

    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(image, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;

      let points = generateRandomPoint(width, height);
      const tempDelaunay = Delaunay.from(points);
      const tempVoronoi = tempDelaunay.voronoi([0, 0, width, height]);

      for (
        let i = 0;
        i < VORONOI_NUMBER_CONSTANT.NUMBER_OF_LLOYD_ATTEMPTS;
        i++
      ) {
        points = lloydRelaxation(tempVoronoi, points);
        tempVoronoi.update();
      }

      /*
      //points 정렬 순서 : x축 -> y축 기준으로 오름차순 정렬
      points.sort((a, b) => {
        const xDiff = a[0] - b[0];
        if (Math.abs(xDiff) > 5) return xDiff;
        return b[1] - a[1];
      });
      */

      // K-Means 기반 클러스터링 진행 (seed 기반 초기 centroids로 결과 고정)
      const lcg = randomLcg(VORONOI_NUMBER_CONSTANT.SEED);
      const initialCentroids: [number, number][] = [];
      for (let i = 0; i < VORONOI_NUMBER_CONSTANT.PERIOD; i++) {
        const idx = Math.floor(lcg() * points.length);
        initialCentroids.push(points[idx]);
      }
      const clusterResult = skmeans(
        points,
        VORONOI_NUMBER_CONSTANT.PERIOD,
        initialCentroids,
      );
      const pointsWithCluster = points.map((point, idx) => ({
        point,
        cluster: clusterResult.idxs[idx],
      }));
      pointsWithCluster.sort((a, b) => a.cluster - b.cluster);
      points = pointsWithCluster.map((p) => p.point);
      const clusters = pointsWithCluster.map((p) => p.cluster);

      const delaunay = Delaunay.from(points);
      const voronoi = delaunay.voronoi([0, 0, width, height]);
      const computedCells = computeCells(
        points,
        voronoi,
        imageData,
        width,
        height,
        clusters,
      );
      setCellData(computedCells);
    };
  }, [imageSrc, width, height]);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || cellData.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    cellData.forEach((cell) => {
      ctx.beginPath();

      if (cell.cluster < streakCount) {
        ctx.fillStyle = cell.color;
        ctx.strokeStyle = cell.color;
      } else {
        ctx.fillStyle = VORONOI_COLOR_CONSTANT.GRAY;
        ctx.strokeStyle = VORONOI_COLOR_CONSTANT.WHITE;
      }

      ctx.fill(cell.path);
      ctx.lineWidth = 0.5;
      ctx.stroke(cell.path);
    });
  }, [cellData, streakCount, width, height]);
  return <canvas className="w-full h-full" ref={canvasRef} />;
}

export default VoronoiStreak;
