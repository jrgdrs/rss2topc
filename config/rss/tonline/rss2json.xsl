<?xml version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" encoding="utf-8"/>

<!-- configure the path here -->
<xsl:variable name="PATH">./tmp/tonline/json/</xsl:variable>
<xsl:param name="SECTION" required="yes"/>

  <xsl:template match="/">
    <xsl:apply-templates select="//item"/>
  </xsl:template>

  <xsl:template match="item">

    <!-- get the encoded content -->
    <xsl:variable name="ENCODED"><xsl:value-of select="*[name()='content:encoded']"/></xsl:variable>
    <!-- cleanup paragraphs -->
    <xsl:variable name="SEARCH">&amp;lt;br /&amp;gt;&amp;lt;br /&amp;gt;</xsl:variable>
    <xsl:variable name="REPLACE">&lt;/p&gt;&lt;p&gt;</xsl:variable>
    <!-- cleanup quotation marks -->
    <xsl:variable name="SEARCH2">"</xsl:variable>
    <xsl:variable name="REPLACE2">\\"</xsl:variable>
    <!-- cleanup missing paragraph breaks -->
    <xsl:variable name="SEARCH3">([a-z0-9\.\\!])([A-Z])</xsl:variable>
    <xsl:variable name="REPLACE3">$1&#60;/p>&#60;p>$2</xsl:variable>

    <!-- set filename -->
    <xsl:variable name="FILENAME">
      <xsl:value-of select="$PATH"/>
      <xsl:analyze-string select="guid" regex=".+/([\d]+)$">
        <xsl:matching-substring>
          <xsl:value-of select="regex-group(1)"/>
        </xsl:matching-substring>
      </xsl:analyze-string>
      <xsl:text>.json</xsl:text>
    </xsl:variable>

    <!-- export one json file per rss item -->
    <xsl:result-document href="{$FILENAME}">{
        "id": "<xsl:analyze-string select="guid" regex=".+/([\d]+)$"><xsl:matching-substring><xsl:value-of select="regex-group(1)"/></xsl:matching-substring></xsl:analyze-string>",
        "subject": "<xsl:value-of select="replace(replace(title,$SEARCH2,$REPLACE2),$SEARCH,$REPLACE)"/>",
        "pubdate": "<xsl:value-of select="pubDate"/>",
        "category":"<xsl:value-of select="$SECTION"/>",
        "caption":"<xsl:value-of select="replace(replace(description,$SEARCH2,$REPLACE2),$SEARCH,$REPLACE)"/>",
        "image":"<xsl:analyze-string select="guid" regex=".+/([\d]+)$"><xsl:matching-substring><xsl:value-of select="regex-group(1)"/></xsl:matching-substring></xsl:analyze-string>-<xsl:analyze-string select="enclosure/@url" regex=".+/(.+)$"><xsl:matching-substring><xsl:variable name="PICNAME" select="regex-group(1)"/><xsl:value-of select="substring($PICNAME,string-length($PICNAME) - 20)"/></xsl:matching-substring></xsl:analyze-string>",
        "body":"&#60;p class=\"start\"><xsl:value-of select="replace(replace(replace($ENCODED,$SEARCH2,$REPLACE2),$SEARCH,$REPLACE),$SEARCH3,$REPLACE3)" disable-output-escaping="yes"/><xsl:text>&#60;/p></xsl:text>"
    }</xsl:result-document>

  </xsl:template>

</xsl:stylesheet>