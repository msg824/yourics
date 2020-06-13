use yourics_development;

ALTER TABLE songlists AUTO_INCREMENT=1;
SET @COUNT = 0;
UPDATE songlists SET id = @COUNT:=@COUNT+1;

