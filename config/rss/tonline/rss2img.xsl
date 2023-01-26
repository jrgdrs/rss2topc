<?xml version="1.0"?>

<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="text" encoding="utf-8"/>

  <xsl:template match="/">
    <xsl:apply-templates select="//item"/>
  </xsl:template>

  <xsl:template match="item"><xsl:if test="enclosure">curl -s <xsl:value-of select="enclosure/@url"/> > ./tmp/tonline/img/<xsl:analyze-string select="guid" regex=".+/([\d]+)$"><xsl:matching-substring><xsl:value-of select="regex-group(1)"/></xsl:matching-substring></xsl:analyze-string>-<xsl:analyze-string select="enclosure/@url" regex=".+/(.+)$"><xsl:matching-substring><xsl:variable name="PICNAME" select="regex-group(1)"/><xsl:value-of select="substring($PICNAME,string-length($PICNAME) - 20)"/></xsl:matching-substring></xsl:analyze-string><xsl:text>

  </xsl:text></xsl:if>

</xsl:template>

</xsl:stylesheet>