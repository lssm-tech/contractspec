export const TRANSCRIPTS_QUERY = `
  query Transcripts(
    $limit: Int
    $skip: Int
    $fromDate: DateTime
    $toDate: DateTime
    $keyword: String
    $scope: TranscriptsQueryScope
  ) {
    transcripts(
      limit: $limit
      skip: $skip
      fromDate: $fromDate
      toDate: $toDate
      keyword: $keyword
      scope: $scope
    ) {
      id
      title
      organizer_email
      participants
      meeting_attendees {
        name
        email
        displayName
      }
      dateString
      duration
      meeting_link
      transcript_url
    }
  }
`;

export const TRANSCRIPT_QUERY = `
  query Transcript($transcriptId: String!) {
    transcript(id: $transcriptId) {
      id
      title
      organizer_email
      participants
      meeting_attendees {
        name
        email
        displayName
      }
      dateString
      duration
      meeting_link
      transcript_url
    }
  }
`;

export const TRANSCRIPT_WITH_SEGMENTS_QUERY = `
  query Transcript($transcriptId: String!) {
    transcript(id: $transcriptId) {
      id
      title
      organizer_email
      participants
      meeting_attendees {
        name
        email
        displayName
      }
      dateString
      duration
      meeting_link
      transcript_url
      sentences {
        index
        speaker_name
        speaker_id
        text
        start_time
        end_time
      }
    }
  }
`;
