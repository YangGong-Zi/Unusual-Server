import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DictVersion } from './dict-version.entity';

@Injectable()
export class DictVersionService {
  constructor(
    @InjectRepository(DictVersion)
    private readonly dictVersionRepository: Repository<DictVersion>
  ) {}

  /**
   * 获取当前字典版本号
   */
  async getCurrentVersion(): Promise<string> {
    // 查找id为1的记录，这是唯一的版本记录
    let versionRecord = await this.dictVersionRepository.findOne({ where: { id: 1 } });
    
    if (!versionRecord) {
      // 如果记录不存在，初始化版本号
      versionRecord = await this.initializeVersion();
    }
    
    return versionRecord.version;
  }

  /**
   * 更新字典版本号
   * @param updater 更新人
   */
  async updateVersion(updater: string): Promise<string> {
    // 开始事务
    return await this.dictVersionRepository.manager.transaction(async (transactionalEntityManager) => {
      // 查找当前版本记录
      let versionRecord = await transactionalEntityManager.findOne(DictVersion, { where: { id: 1 } });
      
      if (!versionRecord) {
        // 如果记录不存在，初始化版本号
        versionRecord = await this.initializeVersion();
      }
      
      // 计算新版本号
      const newVersion = this.incrementVersion(versionRecord.version);
      
      // 更新版本记录
      await transactionalEntityManager.update(DictVersion, { id: 1 }, {
        version: newVersion,
        updater
      });
      
      return newVersion;
    });
  }

  /**
   * 初始化字典版本号
   */
  private async initializeVersion(): Promise<DictVersion> {
    const initialVersion = {
      id: 1,
      version: '00.00.00',
      updater: null
    };
    
    return await this.dictVersionRepository.save(initialVersion);
  }

  /**
   * 递增版本号
   * @param currentVersion 当前版本号，格式：XX.XX.XX
   * @returns 新版本号
   */
  private incrementVersion(currentVersion: string): string {
    // 解析版本号为三个数字部分
    const [majorStr, minorStr, patchStr] = currentVersion.split('.');
    let major = parseInt(majorStr, 10);
    let minor = parseInt(minorStr, 10);
    let patch = parseInt(patchStr, 10);
    
    // 递增patch，处理进位
    patch++;
    
    // patch进位到minor
    if (patch >= 100) {
      patch = 0;
      minor++;
      
      // minor进位到major
      if (minor >= 100) {
        minor = 0;
        major++;
        
        // major达到最大值时重置所有位
        if (major >= 100) {
          major = 0;
          minor = 0;
          patch = 0;
        }
      }
    }
    
    // 格式化回XX.XX.XX格式
    return `${major.toString().padStart(2, '0')}.${minor.toString().padStart(2, '0')}.${patch.toString().padStart(2, '0')}`;
  }
}
