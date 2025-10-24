<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // List all articles
    public function index()
    {
        $articles = Article::with('user')->latest()->paginate(10);
        return view('articles.index', compact('articles'));
    }

    // Show create form
    public function create()
    {
        return view('articles.create');
    }

    // Store new article
   public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'pdf' => 'required|mimes:pdf|max:2048',
            'content' => 'nullable|string',
        ]);

        $pdfPath = $request->file('pdf')->store('pdfs', 'public');

        Article::create([
            'title' => $request->title,
            'content' => $request->content,
            'pdf_path' => $pdfPath,
            'user_id' => auth()->id(), // Gunakan auth()->id() untuk mendapatkan user yang login
        ]);

        return redirect()->route('articles.index')->with('success', 'Artikel PDF berhasil diupload!');
    }

    // Show edit form
    public function edit(Article $article)
    {
        // Cek apakah user bisa edit artikel ini
        if (!auth()->user()->canEditArticle($article)) {
            abort(403, 'You can only edit your own articles.');
        }

        return view('articles.edit', compact('article'));
    }

    // Update existing article
       public function update(Request $request, Article $article)
        {
            // Cek apakah user bisa edit artikel ini
            if (!auth()->user()->canEditArticle($article)) {
                abort(403, 'You can only edit your own articles.');
            }

            $request->validate([
                'title' => 'required|string|max:255',
                'pdf' => 'nullable|mimes:pdf|max:2048',
                'content' => 'nullable|string',
            ]);

            $data = [
                'title' => $request->title,
                'content' => $request->content,
            ];

            if ($request->hasFile('pdf')) {
                $pdfPath = $request->file('pdf')->store('pdfs', 'public');
                $data['pdf_path'] = $pdfPath;
            }

            $article->update($data);

            return redirect()->route('articles.index')->with('success', 'Artikel PDF berhasil diperbarui!');
        }
    // Delete article
    public function destroy(Article $article)
    {
        // Cek apakah user bisa hapus artikel ini
        if (!auth()->user()->canDeleteArticle($article)) {
            abort(403, 'You can only delete your own articles.');
        }

        $article->delete();
        return redirect()->route('articles.index')->with('success', 'Artikel dihapus!');
    }
}