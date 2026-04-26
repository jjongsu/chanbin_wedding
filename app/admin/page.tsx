'use client';

import { FormEvent, useMemo, useState } from 'react';
import styled from 'styled-components';

type CommentStatus = 'visible' | 'hidden';
type CommentFilter = 'all' | CommentStatus;

type ManagedComment = {
    id: string;
    author: string;
    message: string;
    createdAt: string;
    status: CommentStatus;
};

const initialComments: ManagedComment[] = [
    {
        id: 'comment-1',
        author: '민지',
        message: '두 분의 새로운 시작을 진심으로 축하해요. 오래오래 따뜻한 마음으로 함께하길 바랍니다.',
        createdAt: '2026.04.26 14:12',
        status: 'visible',
    },
    {
        id: 'comment-2',
        author: '준호',
        message: '결혼을 축하드립니다. 오늘처럼 환하고 다정한 날들이 계속 이어지길 응원할게요.',
        createdAt: '2026.04.26 14:18',
        status: 'visible',
    },
    {
        id: 'comment-3',
        author: '비공개 손님',
        message: '관리자가 확인한 뒤 다시 노출할 수 있는 숨김 댓글 예시입니다.',
        createdAt: '2026.04.26 14:24',
        status: 'hidden',
    },
];

export default function AdminPage() {
    const [adminId, setAdminId] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [filter, setFilter] = useState<CommentFilter>('all');
    const [comments, setComments] = useState(initialComments);

    const stats = useMemo(() => {
        const visible = comments.filter((comment) => comment.status === 'visible').length;
        const hidden = comments.filter((comment) => comment.status === 'hidden').length;

        return {
            total: comments.length,
            visible,
            hidden,
        };
    }, [comments]);

    const filteredComments = useMemo(() => {
        if (filter === 'all') return comments;

        return comments.filter((comment) => comment.status === filter);
    }, [comments, filter]);

    const handleLogin = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!adminId.trim() || !adminPassword.trim()) return;

        setIsAuthenticated(true);
        setAdminPassword('');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAdminId('');
        setAdminPassword('');
        setFilter('all');
    };

    const updateCommentStatus = (id: string, status: CommentStatus) => {
        setComments((currentComments) =>
            currentComments.map((comment) =>
                comment.id === id
                    ? {
                          ...comment,
                          status,
                      }
                    : comment,
            ),
        );
    };

    const deleteComment = (id: string) => {
        setComments((currentComments) => currentComments.filter((comment) => comment.id !== id));
    };

    if (!isAuthenticated) {
        return (
            <AdminShell>
                <LoginPanel>
                    <AdminMark>관리자</AdminMark>
                    <LoginTitle>댓글 관리</LoginTitle>
                    <LoginCopy>관리자 계정으로 접속하면 댓글의 노출 상태를 관리할 수 있습니다.</LoginCopy>

                    <LoginForm onSubmit={handleLogin}>
                        <Field>
                            <FieldLabel htmlFor="admin-id">아이디</FieldLabel>
                            <TextInput
                                id="admin-id"
                                value={adminId}
                                onChange={(event) => setAdminId(event.target.value)}
                                autoComplete="username"
                                placeholder="관리자 아이디"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="admin-password">비밀번호</FieldLabel>
                            <TextInput
                                id="admin-password"
                                type="password"
                                value={adminPassword}
                                onChange={(event) => setAdminPassword(event.target.value)}
                                autoComplete="current-password"
                                placeholder="관리자 비밀번호"
                            />
                        </Field>
                        <PrimaryButton type="submit">접속하기</PrimaryButton>
                    </LoginForm>
                </LoginPanel>
            </AdminShell>
        );
    }

    return (
        <AdminShell>
            <Dashboard>
                <TopBar>
                    <div>
                        <AdminMark>관리자</AdminMark>
                        <DashboardTitle>댓글 관리</DashboardTitle>
                    </div>
                    <LogoutButton type="button" onClick={handleLogout}>
                        로그아웃
                    </LogoutButton>
                </TopBar>

                <SummaryGrid>
                    <SummaryItem>
                        <SummaryLabel>전체 댓글</SummaryLabel>
                        <SummaryValue>{stats.total}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                        <SummaryLabel>보임</SummaryLabel>
                        <SummaryValue>{stats.visible}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                        <SummaryLabel>숨김</SummaryLabel>
                        <SummaryValue>{stats.hidden}</SummaryValue>
                    </SummaryItem>
                </SummaryGrid>

                <WorkspaceHeader>
                    <WorkspaceTitle>댓글 목록</WorkspaceTitle>
                    <FilterGroup aria-label="댓글 상태 필터">
                        <FilterButton type="button" $active={filter === 'all'} onClick={() => setFilter('all')}>
                            전체
                        </FilterButton>
                        <FilterButton type="button" $active={filter === 'visible'} onClick={() => setFilter('visible')}>
                            보임
                        </FilterButton>
                        <FilterButton type="button" $active={filter === 'hidden'} onClick={() => setFilter('hidden')}>
                            숨김
                        </FilterButton>
                    </FilterGroup>
                </WorkspaceHeader>

                <CommentList>
                    {filteredComments.map((comment) => (
                        <CommentRow key={comment.id} $status={comment.status}>
                            <CommentMeta>
                                <CommentAuthor>{comment.author}</CommentAuthor>
                                <CommentDate>{comment.createdAt}</CommentDate>
                                <StatusBadge $status={comment.status}>{comment.status === 'visible' ? '보임' : '숨김'}</StatusBadge>
                            </CommentMeta>
                            <CommentMessage>{comment.message}</CommentMessage>
                            <ActionGroup>
                                {comment.status === 'visible' ? (
                                    <SecondaryButton type="button" onClick={() => updateCommentStatus(comment.id, 'hidden')}>
                                        숨김
                                    </SecondaryButton>
                                ) : (
                                    <SecondaryButton type="button" onClick={() => updateCommentStatus(comment.id, 'visible')}>
                                        보임
                                    </SecondaryButton>
                                )}
                                <DangerButton type="button" onClick={() => deleteComment(comment.id)}>
                                    삭제
                                </DangerButton>
                            </ActionGroup>
                        </CommentRow>
                    ))}

                    {filteredComments.length === 0 && <EmptyState>해당 상태의 댓글이 없습니다.</EmptyState>}
                </CommentList>
            </Dashboard>
        </AdminShell>
    );
}

const AdminShell = styled.main`
    min-height: 100vh;
    padding: 3rem 1.25rem;
    background:
        linear-gradient(180deg, rgba(248, 246, 242, 0.96), rgba(255, 255, 255, 0.98)),
        radial-gradient(circle at top left, rgba(212, 185, 150, 0.16), transparent 30%);
    color: var(--text-dark);
`;

const LoginPanel = styled.section`
    width: min(100%, 27rem);
    margin: min(12vh, 6rem) auto 0;
    padding: 2rem;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 10px 28px rgba(87, 70, 52, 0.08);
    animation: riseIn 0.4s ease both;

    @keyframes riseIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const AdminMark = styled.p`
    margin: 0 0 0.4rem;
    color: var(--secondary-color);
    font-size: 0.82rem;
    letter-spacing: 0.08em;
`;

const LoginTitle = styled.h1`
    margin: 0;
    font-size: 1.65rem;
    font-weight: 500;
`;

const LoginCopy = styled.p`
    margin: 0.85rem 0 1.5rem;
    color: var(--text-medium);
    font-size: 0.92rem;
    line-height: 1.7;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

const FieldLabel = styled.label`
    color: var(--text-medium);
    font-size: 0.82rem;
`;

const TextInput = styled.input`
    width: 100%;
    height: 2.8rem;
    border: 1px solid #ede5db;
    border-radius: 6px;
    padding: 0 0.85rem;
    background-color: #fffdfb;
    color: var(--text-dark);
    font-family: inherit;
    font-size: 0.92rem;
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

const PrimaryButton = styled.button`
    height: 2.8rem;
    border: none;
    border-radius: 4px;
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

const Dashboard = styled.section`
    width: min(100%, 58rem);
    margin: 0 auto;
    animation: riseIn 0.35s ease both;
`;

const TopBar = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (max-width: 560px) {
        align-items: flex-start;
        flex-direction: column;
    }
`;

const DashboardTitle = styled.h1`
    margin: 0;
    font-size: 1.8rem;
    font-weight: 500;
`;

const LogoutButton = styled.button`
    border: 1px solid #e7dccf;
    border-radius: 4px;
    padding: 0.55rem 0.85rem;
    background-color: transparent;
    color: var(--text-medium);
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--secondary-color);
        color: var(--secondary-color);
    }
`;

const SummaryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.5rem;

    @media (max-width: 560px) {
        grid-template-columns: 1fr;
    }
`;

const SummaryItem = styled.div`
    padding: 1rem;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const SummaryLabel = styled.p`
    margin: 0 0 0.35rem;
    color: var(--text-medium);
    font-size: 0.82rem;
`;

const SummaryValue = styled.strong`
    display: block;
    color: var(--secondary-color);
    font-size: 1.65rem;
    font-weight: 500;
    line-height: 1;
`;

const WorkspaceHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.75rem;

    @media (max-width: 560px) {
        align-items: flex-start;
        flex-direction: column;
    }
`;

const WorkspaceTitle = styled.h2`
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
`;

const FilterGroup = styled.div`
    display: flex;
    gap: 0.35rem;
    padding: 0.25rem;
    border: 1px solid #eee5da;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.72);
`;

const FilterButton = styled.button<{ $active: boolean }>`
    border: none;
    border-radius: 4px;
    padding: 0.45rem 0.7rem;
    background-color: ${(props) => (props.$active ? 'var(--secondary-color)' : 'transparent')};
    color: ${(props) => (props.$active ? 'white' : 'var(--text-medium)')};
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
`;

const CommentList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const CommentRow = styled.article<{ $status: CommentStatus }>`
    padding: 1rem 1.15rem;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    opacity: ${(props) => (props.$status === 'hidden' ? 0.72 : 1)};
`;

const CommentMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 0.55rem;
    flex-wrap: wrap;
`;

const CommentAuthor = styled.h3`
    margin: 0;
    font-size: 0.98rem;
    font-weight: 500;
`;

const CommentDate = styled.time`
    color: var(--text-light);
    font-size: 0.78rem;
`;

const StatusBadge = styled.span<{ $status: CommentStatus }>`
    margin-left: auto;
    border-radius: 999px;
    padding: 0.2rem 0.5rem;
    background-color: ${(props) => (props.$status === 'visible' ? 'rgba(212, 185, 150, 0.18)' : '#f1eeee')};
    color: ${(props) => (props.$status === 'visible' ? 'var(--secondary-color)' : 'var(--text-light)')};
    font-size: 0.75rem;

    @media (max-width: 480px) {
        margin-left: 0;
    }
`;

const CommentMessage = styled.p`
    margin: 0;
    color: var(--text-medium);
    font-size: 0.92rem;
    line-height: 1.75;
    white-space: pre-wrap;
`;

const ActionGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.85rem;
`;

const SecondaryButton = styled.button`
    border: 1px solid #e7dccf;
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    background-color: transparent;
    color: var(--text-medium);
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--secondary-color);
        color: var(--secondary-color);
    }
`;

const DangerButton = styled(SecondaryButton)`
    border-color: rgba(185, 130, 117, 0.35);
    color: #b98275;

    &:hover {
        border-color: #b98275;
        color: #a76d62;
    }
`;

const EmptyState = styled.p`
    margin: 0;
    padding: 2rem 1rem;
    border-radius: 8px;
    background-color: white;
    color: var(--text-light);
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;
