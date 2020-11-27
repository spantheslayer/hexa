import SubAccountKind from "../../enums/SubAccountKind";
import ServiceAccountKind from "../../enums/ServiceAccountKind";
import UTXOCompatibilityGroup from "../../enums/UTXOCompatibilityGroup";
import AccountVisibility from "../../enums/AccountVisibility";
import { ImageSourcePropType } from "react-native";


interface SubAccountDescribing {
  readonly id: string;
  accountShellID: string | null;

  readonly kind: SubAccountKind;

  /**
   * Balance in Satoshis.
   */
  balance: number;

  /**
   * Default displayable title.
   */
  defaultTitle: string;

  /**
   * A display name set by the user
   */
  customDisplayName: string | null;

  /**
   * Default displayable short description
   */
  defaultDescription: string;

  /**
   * A description set by the user.
   */
  customDescription: string | null;

  visibility: AccountVisibility;

  /**
   * Whether or not Two-Factor Authentication is enabled for this sub-account.
   */
  isTFAEnabled: boolean;

  avatarImageSource: ImageSourcePropType;

  utxoCompatibilityGroup: UTXOCompatibilityGroup;
  transactionIDs: string[];
}


export interface HexaSubAccountDescribing extends SubAccountDescribing {}

export interface DonationSubAccountDescribing extends HexaSubAccountDescribing {
  doneeName: string;
  causeName: string;
}

export interface ExternalServiceSubAccountDescribing extends
  SubAccountDescribing {
  readonly serviceAccountKind: ServiceAccountKind;
}

export interface ImportedWalletSubAccountDescribing extends SubAccountDescribing {}


export type SubAccountDescribingConstructorProps = {
  accountShellID?: string | null;
  defaultTitle?: string;
  customDisplayName?: string | null;
  customDescription?: string | null;
  balance?: number;
  visibility?: AccountVisibility;
  isTFAEnabled?: boolean;
  avatarImageSource?: ImageSourcePropType;
  secondaryAccountUUIDs?: string[];
  utxoCompatibilityGroup?: UTXOCompatibilityGroup;
  transactionIDs?: string[];
};


export default SubAccountDescribing;


