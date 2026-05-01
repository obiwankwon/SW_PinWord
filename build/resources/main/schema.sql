-- 1. 사용자 (User)
CREATE TABLE users (
                       user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       name VARCHAR(50) NOT NULL,
                       birth_date DATE,
                       phone_number VARCHAR(20),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 단어 (Word) - 원천 데이터
CREATE TABLE words (
                       word_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       english_spelling VARCHAR(100) NOT NULL,
                       meaning TEXT NOT NULL,
                       part_of_speech VARCHAR(20), -- 명사, 동사 등
                       example_sentence TEXT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 단어장 (Vocabulary Book)
CREATE TABLE vocab_books (
                             book_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             user_id BIGINT,
                             title VARCHAR(100) NOT NULL,
                             description TEXT,
                             FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. 단어장 상세 (Mapping Table)
CREATE TABLE vocab_book_details (
                                    detail_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    book_id BIGINT,
                                    word_id BIGINT,
                                    view_count INT DEFAULT 0,
                                    FOREIGN KEY (book_id) REFERENCES vocab_books(book_id) ON DELETE CASCADE,
                                    FOREIGN KEY (word_id) REFERENCES words(word_id) ON DELETE CASCADE
);

-- 5. 퀴즈 문제지 (Quiz Paper)
CREATE TABLE quiz_papers (
                             paper_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             title VARCHAR(100),
                             total_questions INT DEFAULT 0,
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 퀴즈 문제 상세 (Quiz Questions)
CREATE TABLE quiz_questions (
                                question_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                paper_id BIGINT,
                                word_id BIGINT,
                                question_text TEXT,
                                choice_1 VARCHAR(255),
                                choice_2 VARCHAR(255),
                                choice_3 VARCHAR(255),
                                choice_4 VARCHAR(255),
                                correct_answer INT, -- 1~4번 중 하나
                                FOREIGN KEY (paper_id) REFERENCES quiz_papers(paper_id) ON DELETE CASCADE,
                                FOREIGN KEY (word_id) REFERENCES words(word_id)
);

-- 7. 문제 풀이 내역 (Quiz Results)
CREATE TABLE quiz_results (
                              result_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              user_id BIGINT,
                              paper_id BIGINT,
                              score INT,
                              start_time TIMESTAMP,
                              end_time TIMESTAMP,
                              FOREIGN KEY (user_id) REFERENCES users(user_id),
                              FOREIGN KEY (paper_id) REFERENCES quiz_papers(paper_id)
);

-- 8. 로그인 이력 (Login Logs)
CREATE TABLE login_history (
                               log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               user_id BIGINT,
                               login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               logout_at TIMESTAMP,
                               ip_address VARCHAR(45),
                               FOREIGN KEY (user_id) REFERENCES users(user_id)
);