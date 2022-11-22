import { I18nHistoryIndex } from './I18nHistoryIndex';
import { I18nIndexStatus } from './I18nIndexStatus';
import { I18nOneModule } from './I18nOneModule';

export class I18nHistoryContainer {
  private mapInit: any = {};
  private mapActive: any = {};
  private mapArchive: any = {};

  private static mapDangling: I18nHistoryIndex[] = [];
  private static mapContainer: any = {};

  public static reset() {
    this.mapDangling = [];
    this.mapContainer = {};
  }

  public static prepareChange(current: I18nHistoryIndex, caller: string) {
    // console.log("prepareChange",current,caller);
    this.mapDangling.push(current);
    let con: I18nHistoryContainer;
    let archiveIx: I18nHistoryIndex;
    switch (caller) {
      case 'constructor':
        return;
      case 'status':
        if (this.mapContainer.hasOwnProperty(current.modref)) {
          con = this.mapContainer[current.modref];
          switch (current.status) {
            case I18nIndexStatus.INIT:
              delete con.mapInit[current.internalName];
              break;
            case I18nIndexStatus.ACTIVE:
              delete con.mapActive[current.internalName];
              break;
            case I18nIndexStatus.ARCHIVED:
              delete con.mapArchive[current.internalName];
              break;
          }
          return;
        } else {
          return;
        }
      case 'internalName':
        if (this.mapContainer.hasOwnProperty(current.modref)) {
          con = this.mapContainer[current.modref];
          switch (current.status) {
            case I18nIndexStatus.INIT:
              delete con.mapInit[current.internalName];
              break;
            case I18nIndexStatus.ACTIVE:
              delete con.mapActive[current.internalName];
              break;
            case I18nIndexStatus.ARCHIVED:
              delete con.mapArchive[current.internalName];
              return;
          }
          if (current instanceof I18nOneModule) {
            archiveIx = Object.assign({} as I18nOneModule, current);
          } else {
            archiveIx = Object.assign({} as I18nHistoryIndex, current);
          }
          archiveIx.ArchiveDirect();
          con.mapArchive[current.internalName] = archiveIx;
          current.IncrementInternalVersion(true);
          return;
        } else {
          return;
        }
    }
  }
  public static finalizeChange(current: I18nHistoryIndex, caller: string) {
    // console.log("finalizeChange",current,caller);
    const old = this.mapDangling.pop();
    let con: I18nHistoryContainer;
    switch (caller) {
      case 'constructor':
        con = new I18nHistoryContainer();
        break;
      default:
        if (this.mapContainer.hasOwnProperty(old?.modref || '')) {
          con = this.mapContainer[old?.modref || ''];
        } else {
          con = new I18nHistoryContainer();
        }
        break;
    }
    switch (current.status) {
      case I18nIndexStatus.INIT:
        con.mapInit[current.internalName] = current;
        break;
      case I18nIndexStatus.ACTIVE:
        con.mapActive[current.internalName] = current;
        break;
      case I18nIndexStatus.ARCHIVED:
        con.mapArchive[current.internalName] = current;
        break;
    }
  }
}
