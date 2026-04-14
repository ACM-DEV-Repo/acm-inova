import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderRichText } from '@/lib/cms-v2/rich-text';

// Helper: renderiza o resultado do renderRichText dentro de um container
function renderResult(text: string | undefined, accentColor?: string) {
  const result = renderRichText(text, accentColor);
  return render(<div data-testid="output">{result}</div>);
}

describe('renderRichText', () => {
  // ── Entradas vazias / falsy ──
  describe('entradas vazias e falsy', () => {
    it('retorna null para undefined', () => {
      expect(renderRichText(undefined)).toBeNull();
    });

    it('retorna null para string vazia', () => {
      expect(renderRichText('')).toBeNull();
    });
  });

  // ── Texto simples (sem marcadores) ──
  describe('texto simples', () => {
    it('renderiza texto puro sem transformacao', () => {
      renderResult('Texto simples sem marcadores');
      expect(screen.getByTestId('output')).toHaveTextContent('Texto simples sem marcadores');
    });

    it('renderiza texto com caracteres especiais', () => {
      renderResult('Preco: R$ 100,00 & mais');
      expect(screen.getByTestId('output')).toHaveTextContent('Preco: R$ 100,00 & mais');
    });
  });

  // ── Bold (**texto**) ──
  describe('bold (**texto**)', () => {
    it('renderiza **texto** como <strong>', () => {
      const { container } = renderResult('Isso e **importante** demais');
      const strong = container.querySelector('strong');

      expect(strong).not.toBeNull();
      expect(strong!.textContent).toBe('importante');
    });

    it('renderiza multiplos bolds na mesma linha', () => {
      const { container } = renderResult('**primeiro** e **segundo**');
      const strongs = container.querySelectorAll('strong');

      expect(strongs).toHaveLength(2);
      expect(strongs[0].textContent).toBe('primeiro');
      expect(strongs[1].textContent).toBe('segundo');
    });

    it('texto ao redor do bold e preservado', () => {
      renderResult('antes **meio** depois');
      const output = screen.getByTestId('output');
      expect(output).toHaveTextContent('antes meio depois');
    });
  });

  // ── Highlight ({{texto}}) ──
  describe('highlight ({{texto}})', () => {
    it('renderiza {{texto}} como <span> com classe font-semibold', () => {
      const { container } = renderResult('Isso e {{destaque}} aqui');
      const span = container.querySelector('span.font-semibold');

      expect(span).not.toBeNull();
      expect(span!.textContent).toBe('destaque');
    });

    it('usa cor accent padrao quando accentColor nao e fornecida', () => {
      // Inspecionar React element tree diretamente pra verificar a prop style.color
      const result = renderRichText('{{destaque}}');
      // result e array de React.Fragment, cada um contendo parseLine output
      // Vamos serializar e procurar a cor na arvore
      const rendered = render(<div data-testid="accent">{result}</div>);
      const span = rendered.container.querySelector('span.font-semibold');
      expect(span).not.toBeNull();
      // Confirma que o span tem o style attribute com a CSS var
      // jsdom nao processa CSS vars, entao style.color fica vazio
      // Mas podemos verificar que a propriedade foi setada corretamente
      // checando que sem accentColor, o span renderiza (confirma fallback funciona)
      expect(span!.className).toContain('font-semibold');
      expect(span!.textContent).toBe('destaque');

      // Verificacao direta: renderRichText gera React elements com a style correta
      // Pra isso, inspecionamos a React element tree
      const elements = React.Children.toArray(result as React.ReactNode);
      expect(elements.length).toBeGreaterThan(0);

      // Encontrar o span element na arvore recursivamente
      function findSpanStyle(node: React.ReactNode): string | undefined {
        if (!React.isValidElement(node)) return undefined;
        const props = node.props as Record<string, unknown>;
        if (node.type === 'span' && props.style) {
          return (props.style as { color: string }).color;
        }
        const children = React.Children.toArray(props.children as React.ReactNode);
        for (const child of children) {
          const found = findSpanStyle(child);
          if (found) return found;
        }
        return undefined;
      }

      const color = findSpanStyle(elements[0]);
      expect(color).toBe('hsl(var(--ds-color-accent))');
    });

    it('usa accentColor customizada quando fornecida', () => {
      // Verificar diretamente na React element tree
      const result = renderRichText('{{destaque}}', '#ff0000');
      const elements = React.Children.toArray(result as React.ReactNode);

      function findSpanStyle(node: React.ReactNode): string | undefined {
        if (!React.isValidElement(node)) return undefined;
        const props = node.props as Record<string, unknown>;
        if (node.type === 'span' && props.style) {
          return (props.style as { color: string }).color;
        }
        const children = React.Children.toArray(props.children as React.ReactNode);
        for (const child of children) {
          const found = findSpanStyle(child);
          if (found) return found;
        }
        return undefined;
      }

      const color = findSpanStyle(elements[0]);
      expect(color).toBe('#ff0000');
    });

    it('renderiza multiplos highlights', () => {
      const { container } = renderResult('{{um}} e {{dois}}');
      const spans = container.querySelectorAll('span.font-semibold');

      expect(spans).toHaveLength(2);
      expect(spans[0].textContent).toBe('um');
      expect(spans[1].textContent).toBe('dois');
    });
  });

  // ── Quebra de linha (\n) ──
  describe('quebra de linha', () => {
    it('renderiza \\n como <br>', () => {
      const { container } = renderResult('Linha 1\nLinha 2');
      const brs = container.querySelectorAll('br');

      expect(brs).toHaveLength(1);
    });

    it('renderiza multiplas quebras de linha', () => {
      const { container } = renderResult('L1\nL2\nL3');
      const brs = container.querySelectorAll('br');

      expect(brs).toHaveLength(2);
    });

    it('preserva texto em cada linha', () => {
      renderResult('Primeira\nSegunda\nTerceira');
      const output = screen.getByTestId('output');
      expect(output).toHaveTextContent('PrimeiraSegundaTerceira');
    });
  });

  // ── Combinacoes ──
  describe('combinacoes de marcadores', () => {
    it('bold + highlight na mesma linha', () => {
      const { container } = renderResult('**negrito** e {{destaque}}');
      const strong = container.querySelector('strong');
      const span = container.querySelector('span.font-semibold');

      expect(strong).not.toBeNull();
      expect(strong!.textContent).toBe('negrito');
      expect(span).not.toBeNull();
      expect(span!.textContent).toBe('destaque');
    });

    it('bold + quebra de linha + highlight', () => {
      const { container } = renderResult('**titulo**\n{{subtitulo}}');
      const strong = container.querySelector('strong');
      const span = container.querySelector('span.font-semibold');
      const br = container.querySelector('br');

      expect(strong).not.toBeNull();
      expect(span).not.toBeNull();
      expect(br).not.toBeNull();
    });

    it('texto misto complexo', () => {
      const input = 'Bem-vindo ao **ACM**\nSua {{saude}} em primeiro lugar';
      const { container } = renderResult(input);

      expect(container.querySelector('strong')!.textContent).toBe('ACM');
      expect(container.querySelector('span.font-semibold')!.textContent).toBe('saude');
      expect(container.querySelectorAll('br')).toHaveLength(1);
    });
  });

  // ── Edge cases ──
  describe('edge cases', () => {
    it('asteriscos simples nao sao bold', () => {
      const { container } = renderResult('*nao e bold*');
      expect(container.querySelector('strong')).toBeNull();
      expect(screen.getByTestId('output')).toHaveTextContent('*nao e bold*');
    });

    it('chaves simples nao sao highlight', () => {
      const { container } = renderResult('{nao e highlight}');
      expect(container.querySelector('span.font-semibold')).toBeNull();
      expect(screen.getByTestId('output')).toHaveTextContent('{nao e highlight}');
    });

    it('bold vazio **  ** ainda renderiza (conteudo com espaco)', () => {
      const { container } = renderResult('** **');
      // Regex exige (.+?), entao espaco simples deveria casar
      const strong = container.querySelector('strong');
      expect(strong).not.toBeNull();
      expect(strong!.textContent).toBe(' ');
    });

    it('nao usa dangerouslySetInnerHTML (seguranca)', () => {
      const { container } = renderResult('<script>alert(1)</script>');
      // Se usasse innerHTML, teria um script tag. Como gera React elements, nao tem.
      expect(container.querySelector('script')).toBeNull();
      expect(screen.getByTestId('output')).toHaveTextContent('<script>alert(1)</script>');
    });

    it('HTML tags dentro de bold sao tratados como texto', () => {
      const { container } = renderResult('**<img src=x onerror=alert(1)>**');
      const strong = container.querySelector('strong');
      expect(strong).not.toBeNull();
      expect(strong!.textContent).toBe('<img src=x onerror=alert(1)>');
      expect(container.querySelector('img')).toBeNull();
    });

    it('texto so com newlines renderiza brs', () => {
      const { container } = renderResult('\n\n\n');
      const brs = container.querySelectorAll('br');
      expect(brs).toHaveLength(3);
    });
  });

  // ── Retorno e React element (nao string) ──
  describe('tipo de retorno', () => {
    it('retorna React elements (array), nao string', () => {
      const result = renderRichText('teste');
      expect(result).not.toBeNull();
      expect(typeof result).not.toBe('string');
    });
  });
});
