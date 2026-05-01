package pinword.entity;

/**
 * Entity가 아님
 * [문제 유형 열거형 (Enum)]
 * 퀴즈 문제의 종류를 정의합니다.
 * 이 값들 외에는 DB에 저장될 수 없도록 강제하여 데이터의 일관성을 유지합니다.
 */
public enum QuestionType {
    MULTIPLE_CHOICE, // 4지선다 (객관식)
    SHORT_ANSWER     // 단답형 (주관식)
}