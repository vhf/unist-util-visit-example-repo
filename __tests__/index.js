import dedent from 'dedent'
import unified from 'unified'
import inspect from 'unist-util-inspect'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

const fixture = dedent`
  1 [^alpha bravo one]
  2 [^alpha bravo two]
  3 [^alpha bravo third]
  4 [^w]
  4 [^w]
  5 [^alpha bravo fourth]

  [^w]: foo
`

const expected = dedent`
  <p>1 <sup id="fnref-1"><a href="#fn-1" class="footnote-ref">1</a></sup>
  2 <sup id="fnref-2"><a href="#fn-2" class="footnote-ref">2</a></sup>
  3 <sup id="fnref-3"><a href="#fn-3" class="footnote-ref">3</a></sup>
  4 <sup id="fnref-5"><a href="#fn-5" class="footnote-ref">5</a></sup>
  4 <sup id="fnref-5"><a href="#fn-5" class="footnote-ref">5</a></sup>
  5 <sup id="fnref-4"><a href="#fn-4" class="footnote-ref">4</a></sup></p>
  <div class="footnotes">
  <hr>
  <ol>
  <li id="fn-1">
  alpha bravo one
  <a href="#fnref-1" class="footnote-backref">↩</a>
  </li>
  <li id="fn-2">
  alpha bravo two
  <a href="#fnref-2" class="footnote-backref">↩</a>
  </li>
  <li id="fn-3">
  alpha bravo third
  <a href="#fnref-3" class="footnote-backref">↩</a>
  </li>
  <li id="fn-4">
  alpha bravo fourth
  <a href="#fnref-4" class="footnote-backref">↩</a>
  </li>
  <li id="fn-5">
  <p>foo</p>
  <a href="#fnref-5" class="footnote-backref">↩</a>
  </li>
  </ol>
  </div>
`

test('regression-2', () => {
  const {contents} = unified()
    .use(reParse, {gfm: true, commonmark: false, footnotes: true})
    .use(require('../src'))
    .use(remark2rehype)
    .use(stringify)
    .processSync(fixture)

  expect(contents.trim()).toBe(expected)
})

const tree = unified()
  .use(reParse, {gfm: true, commonmark: false, footnotes: true})
  .parse(fixture)

console.log(inspect(tree))
