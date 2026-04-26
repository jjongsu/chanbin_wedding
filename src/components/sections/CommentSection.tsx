'use client';

import { FormEvent, useState } from 'react';
import styled from 'styled-components';

type CommentSectionProps = BaseComponentProps;

type GuestComment = {
    id: number;
    author: string;
    message: string;
    createdAt: string;
};

type CommentAction = {
    id: number;
    mode: 'edit' | 'delete';
} | null;

const initialComments: GuestComment[] = [
    {
        id: 1,
        author: '민지',
        message: '두 분의 새로운 시작을 진심으로 축하해요. 오래오래 따뜻한 마음으로 함께하길 바랍니다.',
        createdAt: '2026.04.26',
    },
    {
        id: 2,
        author: '준호',
        message: '결혼을 축하드립니다. 오늘처럼 환하고 다정한 날들이 계속 이어지길 응원할게요.',
        createdAt: '2026.04.26',
    },
];

export default function CommentSection({ bgColor = 'white' }: CommentSectionProps) {
    const [comments, setComments] = useState(initialComments);
    const [author, setAuthor] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [activeAction, setActiveAction] = useState<CommentAction>(null);
    const [actionPassword, setActionPassword] = useState('');
    const [editMessage, setEditMessage] = useState('');

    const resetForm = () => {
        setAuthor('');
        setPassword('');
        setMessage('');
    };

    const resetAction = () => {
        setActiveAction(null);
        setActionPassword('');
        setEditMessage('');
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!author.trim() || !password.trim() || !message.trim()) return;

        const nextComment: GuestComment = {
            id: Date.now(),
            author: author.trim(),
            message: message.trim(),
            createdAt: new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
                .format(new Date())
                .replace(/\. /g, '.')
                .replace(/\.$/, ''),
        };

        setComments((currentComments) => [nextComment, ...currentComments]);
        resetForm();
    };

    const openAction = (comment: GuestComment, mode: 'edit' | 'delete') => {
        setActiveAction({ id: comment.id, mode });
        setActionPassword('');
        setEditMessage(comment.message);
    };

    const handleEdit = () => {
        if (!activeAction || !editMessage.trim()) return;

        setComments((currentComments) =>
            currentComments.map((comment) =>
                comment.id === activeAction.id
                    ? {
                          ...comment,
                          message: editMessage.trim(),
                      }
                    : comment,
            ),
        );
        resetAction();
    };

    const handleDelete = () => {
        if (!activeAction) return;

        setComments((currentComments) => currentComments.filter((comment) => comment.id !== activeAction.id));
        resetAction();
    };

    return (
        <CommentSectionContainer $bgColor={bgColor}>
            <SectionTitle>축하 메시지</SectionTitle>
            <SectionIntro>두 사람에게 전하고 싶은 마음을 남겨주세요.</SectionIntro>

            <CommentLayout>
                <CommentForm onSubmit={handleSubmit}>
                    <FieldGroup>
                        <CompactField>
                            <FieldLabel htmlFor="comment-author">이름</FieldLabel>
                            <TextInput
                                id="comment-author"
                                value={author}
                                onChange={(event) => setAuthor(event.target.value)}
                                maxLength={40}
                                autoComplete="name"
                                placeholder="이름"
                            />
                        </CompactField>

                        <CompactField>
                            <FieldLabel htmlFor="comment-password">비밀번호</FieldLabel>
                            <TextInput
                                id="comment-password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                maxLength={40}
                                autoComplete="new-password"
                                placeholder="수정/삭제용"
                            />
                        </CompactField>
                    </FieldGroup>

                    <Field>
                        <FieldLabel htmlFor="comment-message">메시지</FieldLabel>
                        <MessageInput
                            id="comment-message"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            maxLength={500}
                            placeholder="축하의 마음을 적어주세요."
                        />
                    </Field>

                    <FormFooter>
                        <CountText>{message.length}/500</CountText>
                        <SubmitButton type="submit">등록하기</SubmitButton>
                    </FormFooter>
                </CommentForm>

                <CommentToolbar>
                    <CommentCount>방명록 {comments.length}개</CommentCount>
                </CommentToolbar>

                <CommentList>
                    {comments.map((comment) => {
                        const isActive = activeAction?.id === comment.id;

                        return (
                            <CommentItem key={comment.id}>
                                <CommentHeader>
                                    <CommentAuthor>{comment.author}</CommentAuthor>
                                    <CommentDate>{comment.createdAt}</CommentDate>
                                </CommentHeader>
                                <CommentMessage>{comment.message}</CommentMessage>

                                <CommentActions>
                                    <TextButton type="button" onClick={() => openAction(comment, 'edit')}>
                                        수정
                                    </TextButton>
                                    <TextButton type="button" onClick={() => openAction(comment, 'delete')}>
                                        삭제
                                    </TextButton>
                                </CommentActions>

                                {isActive && (
                                    <ActionPanel>
                                        {activeAction.mode === 'edit' ? (
                                            <>
                                                <PanelTextarea value={editMessage} onChange={(event) => setEditMessage(event.target.value)} maxLength={500} />
                                                <PanelInput
                                                    type="password"
                                                    value={actionPassword}
                                                    onChange={(event) => setActionPassword(event.target.value)}
                                                    autoComplete="current-password"
                                                    placeholder="댓글 비밀번호"
                                                />
                                                <PanelActions>
                                                    <PanelButton type="button" onClick={handleEdit}>
                                                        저장
                                                    </PanelButton>
                                                    <GhostButton type="button" onClick={resetAction}>
                                                        취소
                                                    </GhostButton>
                                                </PanelActions>
                                            </>
                                        ) : (
                                            <>
                                                <DeleteText>이 메시지를 삭제할까요?</DeleteText>
                                                <PanelInput
                                                    type="password"
                                                    value={actionPassword}
                                                    onChange={(event) => setActionPassword(event.target.value)}
                                                    autoComplete="current-password"
                                                    placeholder="댓글 비밀번호"
                                                />
                                                <PanelActions>
                                                    <DangerButton type="button" onClick={handleDelete}>
                                                        삭제
                                                    </DangerButton>
                                                    <GhostButton type="button" onClick={resetAction}>
                                                        취소
                                                    </GhostButton>
                                                </PanelActions>
                                            </>
                                        )}
                                    </ActionPanel>
                                )}
                            </CommentItem>
                        );
                    })}
                </CommentList>
            </CommentLayout>
        </CommentSectionContainer>
    );
}

const CommentSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
    padding: 4rem 1.5rem;
    text-align: center;
    background-color: ${(props) => (props.$bgColor === 'beige' ? '#F8F6F2' : 'white')};
`;

const SectionTitle = styled.h2`
    position: relative;
    display: inline-block;
    margin-bottom: 2rem;
    font-weight: 500;
    font-size: 1.5rem;

    &::after {
        content: '';
        position: absolute;
        bottom: -16px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--secondary-color);
    }
`;

const SectionIntro = styled.p`
    max-width: 36rem;
    margin: 0 auto 2rem;
    color: var(--text-medium);
    font-size: 0.95rem;
    line-height: 1.8;
`;

const CommentLayout = styled.div`
    max-width: 40rem;
    margin: 0 auto;
    text-align: left;
`;

const CommentForm = styled.form`
    padding: 1.25rem;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const FieldGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 0.85rem;

    @media (max-width: 520px) {
        grid-template-columns: 1fr;
    }
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
`;

const CompactField = styled(Field)``;

const FieldLabel = styled.label`
    color: var(--text-medium);
    font-size: 0.82rem;
`;

const inputBaseStyles = `
    width: 100%;
    border: 1px solid #ede5db;
    border-radius: 6px;
    background-color: #fffdfb;
    color: var(--text-dark);
    font-family: inherit;
    outline: none;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;

    &::placeholder {
        color: #b8aea3;
    }

    &:focus {
        border-color: var(--secondary-color);
        background-color: white;
        box-shadow: 0 0 0 3px rgba(212, 185, 150, 0.18);
    }
`;

const TextInput = styled.input`
    ${inputBaseStyles}
    height: 2.75rem;
    padding: 0 0.85rem;
    font-size: 0.92rem;
`;

const MessageInput = styled.textarea`
    ${inputBaseStyles}
    min-height: 7.5rem;
    resize: vertical;
    padding: 0.85rem;
    font-size: 0.95rem;
    line-height: 1.7;
`;

const FormFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 0.9rem;
`;

const CountText = styled.span`
    color: var(--text-light);
    font-size: 0.8rem;
`;

const SubmitButton = styled.button`
    min-width: 7rem;
    border: none;
    border-radius: 4px;
    padding: 0.7rem 1.25rem;
    background-color: var(--secondary-color);
    color: white;
    font-family: inherit;
    font-size: 0.95rem;
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
        background-color: #c4a986;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(1px);
    }
`;

const CommentToolbar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin: 1.75rem 0 0.75rem;
`;

const CommentCount = styled.p`
    margin: 0;
    color: var(--text-medium);
    font-size: 0.9rem;
`;

const CommentList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
`;

const CommentItem = styled.article`
    padding: 1.15rem 1.25rem;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    animation: commentReveal 0.32s ease both;

    @keyframes commentReveal {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: baseline;
    margin-bottom: 0.6rem;
`;

const CommentAuthor = styled.h3`
    margin: 0;
    font-size: 0.98rem;
    font-weight: 500;
    color: var(--text-dark);
`;

const CommentDate = styled.time`
    color: var(--text-light);
    font-size: 0.78rem;
    white-space: nowrap;
`;

const CommentMessage = styled.p`
    margin: 0;
    color: var(--text-medium);
    font-size: 0.92rem;
    line-height: 1.8;
    white-space: pre-wrap;
    word-break: keep-all;
`;

const CommentActions = styled.div`
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-top: 0.8rem;
`;

const TextButton = styled.button`
    border: none;
    padding: 0;
    background: none;
    color: var(--text-light);
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: var(--secondary-color);
    }
`;

const ActionPanel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    margin-top: 0.9rem;
    padding-top: 0.9rem;
    border-top: 1px solid #f0e9df;
`;

const PanelInput = styled.input`
    ${inputBaseStyles}
    height: 2.55rem;
    padding: 0 0.75rem;
    font-size: 0.88rem;
`;

const PanelTextarea = styled.textarea`
    ${inputBaseStyles}
    min-height: 5.5rem;
    resize: vertical;
    padding: 0.75rem;
    font-size: 0.9rem;
    line-height: 1.7;
`;

const PanelActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
`;

const PanelButton = styled.button`
    border: none;
    border-radius: 4px;
    padding: 0.55rem 0.85rem;
    background-color: var(--secondary-color);
    color: white;
    font-family: inherit;
    font-size: 0.85rem;
    cursor: pointer;
`;

const GhostButton = styled(PanelButton)`
    border: 1px solid #e7dccf;
    background-color: transparent;
    color: var(--text-medium);
`;

const DangerButton = styled(PanelButton)`
    background-color: #b98275;
`;

const DeleteText = styled.p`
    margin: 0;
    color: var(--text-medium);
    font-size: 0.9rem;
`;
