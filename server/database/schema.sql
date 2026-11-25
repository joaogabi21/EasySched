PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL UNIQUE,
    cor TEXT NOT NULL DEFAULT '#3b82f6'
);

CREATE TABLE IF NOT EXISTS atividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT DEFAULT '',
    data TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fim TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido')),
    ativar_lembrete INTEGER NOT NULL DEFAULT 0 CHECK (ativar_lembrete IN (0, 1)),
    antecedencia TEXT DEFAULT '15',
    canal_alerta TEXT DEFAULT 'navegador',
    categoria_id INTEGER NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);

INSERT OR IGNORE INTO categorias (id, slug, nome, cor) VALUES
    (1, 'estudos', 'Estudos', '#2563eb'),
    (2, 'trabalho', 'Trabalho', '#7c3aed'),
    (3, 'saude', 'Saúde', '#16a34a'),
    (4, 'lazer', 'Lazer', '#ea580c');