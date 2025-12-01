/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { RecruitmentService } from './recruitment.service';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { describe, beforeEach, it, expect } = require('@jest/globals');

describe('RecruitmentService', () => {
  let service: RecruitmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruitmentService],
    }).compile();

    service = module.get<RecruitmentService>(RecruitmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});