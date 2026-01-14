import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GraphService } from './graph.service';
import { GraphResponseDto } from './dtos/graph-response.dto';

@ApiTags('graph')
@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get('user/:userId')
  @ApiOperation({
    summary: '유저별 그래프 데이터 조회',
    description:
      '특정 유저가 학습한 문제와 키워드로 구성된 그래프 데이터를 조회합니다. 문제 노드, 키워드 노드, 그리고 노드 간 연결 관계를 포함합니다.',
  })
  @ApiParam({
    name: 'userId',
    description: '조회할 유저 ID',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: '그래프 데이터 조회 성공',
    type: GraphResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: '그래프 데이터가 없는 경우 빈 배열 반환',
    type: GraphResponseDto,
    example: {
      nodes: [],
      edges: [],
    },
  })
  async getGraphByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GraphResponseDto> {
    return await this.graphService.getGraphByUserId(userId);
  }
}
