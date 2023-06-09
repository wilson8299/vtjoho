export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      agency: {
        Row: {
          createdAt: string;
          name: string;
        };
        Insert: {
          createdAt?: string;
          name: string;
        };
        Update: {
          createdAt?: string;
          name?: string;
        };
      };
      favorite: {
        Row: {
          favorite: string[];
          id: string;
        };
        Insert: {
          favorite: string[];
          id: string;
        };
        Update: {
          favorite?: string[];
          id?: string;
        };
      };
      member: {
        Row: {
          agency: string;
          avatarName: string;
          banner: string | null;
          channelTitle: string;
          createdAt: string;
          enName: string;
          id: string;
          jpName: string;
          official: boolean;
          twitter: string | null;
        };
        Insert: {
          agency: string;
          avatarName: string;
          banner?: string | null;
          channelTitle: string;
          createdAt?: string;
          enName: string;
          id: string;
          jpName: string;
          official?: boolean;
          twitter?: string | null;
        };
        Update: {
          agency?: string;
          avatarName?: string;
          banner?: string | null;
          channelTitle?: string;
          createdAt?: string;
          enName?: string;
          id?: string;
          jpName?: string;
          official?: boolean;
          twitter?: string | null;
        };
      };
      profiles: {
        Row: {
          createdAt: string | null;
          email: string;
          id: string;
          role: string;
        };
        Insert: {
          createdAt?: string | null;
          email: string;
          id: string;
          role: string;
        };
        Update: {
          createdAt?: string | null;
          email?: string;
          id?: string;
          role?: string;
        };
      };
      video: {
        Row: {
          agencyName: string;
          channelTitle: string;
          id: string;
          liveBroadcastContent: string;
          memberId: string;
          publishedAt: string;
          startTime: string | null;
          title: string;
        };
        Insert: {
          agencyName: string;
          channelTitle: string;
          id: string;
          liveBroadcastContent?: string;
          memberId: string;
          publishedAt: string;
          startTime?: string | null;
          title: string;
        };
        Update: {
          agencyName?: string;
          channelTitle?: string;
          id?: string;
          liveBroadcastContent?: string;
          memberId?: string;
          publishedAt?: string;
          startTime?: string | null;
          title?: string;
        };
      };
      videoDetail: {
        Row: {
          description: string | null;
          id: string;
        };
        Insert: {
          description?: string | null;
          id: string;
        };
        Update: {
          description?: string | null;
          id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_live2: {
        Args: { agency: string; prevdate: string; afterdate: string };
        Returns: {
          videoId: string;
          channelTitle: string;
          title: string;
          description: string;
          startTime: string;
          liveBroadcastContent: string;
          memberId: string;
          agencyId: string;
          jp: string;
          en: string;
        }[];
      };
      get_video: {
        Args: {
          idloc: string;
          typeloc: string;
          prevdate: string;
          afterdate: string;
        };
        Returns: {
          videoId: string;
          channelTitle: string;
          title: string;
          description: string;
          startTime: string;
          type: string;
          liveBroadcastContent: string;
          memberId: string;
          agencyId: string;
          jp: string;
          en: string;
        }[];
      };
      search_similarity: {
        Args: { search: string };
        Returns: {
          id: string;
          jpName: string;
          enName: string;
          avatarName: string;
          agency: string;
        }[];
      };
      upsert_video:
        | {
            Args: {
              videoid: string;
              channeltitle: string;
              title: string;
              livebroadcastcontent: string;
              memberid: string;
              starttime: string;
              publishedat: string;
              description: string;
            };
            Returns: undefined;
          }
        | {
            Args: {
              videoid: string;
              channeltitle: string;
              title: string;
              livebroadcastcontent: string;
              memberid: string;
              publishedat: string;
              description: string;
            };
            Returns: undefined;
          };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
